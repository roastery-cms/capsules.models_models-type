import { ModelsTypeDependenciesDTO } from "@/infra/dependencies";
import { CacheEnvDependenciesDTO } from "@roastery-adapters/cache/dtos";
import { AuthEnvDependenciesDTO } from "@roastery-capsules/auth/dtos";
import { baristaEnv } from "@roastery-capsules/env";
import { barista } from "@roastery/barista";
import { baristaErrorHandler } from "@roastery-capsules/api-error-handler";
import { baristaResponseMapper } from "@roastery-capsules/api-response-mapper";
import { cache } from "@roastery-adapters/cache";
import type { IModelsTypeRepository } from "@/domain/types/repositories";
import { makeModelsTypeRepository } from "@/infra/factories/repositories";
import { modelsAdapter as _modelsAdapter } from "@roastery-adapters/models/plugins";
import { ModelsTypeRepositoryPlugin } from "../plugins";
import { GetAccessController } from "@roastery-capsules/auth/plugins/controllers";
import { ModelsTypeRoutes } from "../routes";
import { baristaApiDocs } from "@roastery-capsules/api-docs";

export async function bootstrap(open: boolean = false) {
	const app = barista({ name: "@roastery" })
		.use(
			baristaEnv(
				CacheEnvDependenciesDTO,
				AuthEnvDependenciesDTO,
				ModelsTypeDependenciesDTO,
			),
		)
		.use(baristaErrorHandler)
		.use(baristaResponseMapper)
		.use((app) => {
			const { CACHE_PROVIDER, REDIS_URL } = app.decorator.env;

			return app.use(cache({ CACHE_PROVIDER, REDIS_URL }));
		});

	const { env } = app.decorator;

	let modelsTypeRepository: IModelsTypeRepository = {} as never;

	const {
		AUTH_EMAIL,
		AUTH_PASSWORD,
		CACHE_PROVIDER,
		JWT_SECRET,
		NODE_ENV,
		PORT,
		DATABASE_PROVIDER,
		DATABASE_URL,
		REDIS_URL,
	} = env;

	if (DATABASE_URL && DATABASE_PROVIDER === "PRISMA") {
		const modelsAdapter = await _modelsAdapter(DATABASE_URL);

		app.use(modelsAdapter).use((app) => {
			const { modelsPrismaClient: prismaClient, cache } = app.decorator;

			modelsTypeRepository = makeModelsTypeRepository({
				cache,
				prismaClient,
				target: DATABASE_PROVIDER,
			});

			return app;
		});
	} else {
		const { cache } = app.decorator;

		modelsTypeRepository = makeModelsTypeRepository({
			cache,
			target: "MEMORY",
		});
	}

	return app
		.use(
			GetAccessController({
				AUTH_EMAIL,
				AUTH_PASSWORD,
				CACHE_PROVIDER,
				JWT_SECRET,
				REDIS_URL,
			}),
		)
		.use(ModelsTypeRepositoryPlugin(modelsTypeRepository))
		.use((app) =>
			app.use(
				ModelsTypeRoutes({
					cacheProvider: CACHE_PROVIDER,
					jwtSecret: JWT_SECRET,
					redisUrl: REDIS_URL,
					modelsTypeRepository: app.decorator.modelsTypeRepository,
				}),
			),
		)
		.use(
			baristaApiDocs(NODE_ENV === "DEVELOPMENT", `http://localhost:${PORT}`, {
				info: {
					title: "Roastery",
					version: "1.0",
					contact: {
						email: "alanreisanjo@gmail.com",
						name: "Alan Reis",
						url: "https://hoyasumii.dev",
					},
					description:
						"A RESTful API for managing Post Types within the Roastery CMS platform. This microservice is responsible for creating, retrieving, updating, and deleting Post Types, handling global uniqueness through slugs, schema management for diverse content structures, and toggleable highlight states.",
				},
			}),
		)
		.use((app) => {
			if (open) {
				app.listen(app.decorator.env.PORT, () => {
					console.log(
						`☕️ Server is running at: http://localhost:${app.decorator.env.PORT}`,
					);
				});
			}

			return app;
		});
}
