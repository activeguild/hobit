import vs from 'value-schema';

export interface Env {
}

// クエリーパラメータのスキーマ定義
// Learn more at https://github.com/shimataro/value-schema
interface QueryParams {
	[key: string]: string;
}
const QuerySchema = {
	name: vs.string({
		ifUndefined: 'world',
	}),
	age: vs.number(),
	gender: vs.string({
		only: ['male', 'female'],
	}),
}

// Bodyパラメータのスキーマ定義
// Learn more at https://github.com/shimataro/value-schema
const RequestBodySchema = {
	key1: vs.string(),
	key2: vs.number({
		ifUndefined: 0,
	}),
	key3: vs.string({
		only: ['a', 'b', 'c'],
	}),
}

// パラメータのエラーハンドラ
let errors:string[] = [];
const errorHandler = (err: any) => {
	const key = err.keyStack.shift();
	errors.push(key);
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.info(`🐞 Function start...`);
		const url = new URL(request.url);
		const pathArray = url.pathname.split('/');
		const searchParams = url.searchParams;
		const queryParams: QueryParams = {}
		for (const [key, value] of searchParams) queryParams[key] = value;

		// メソッドとパスごとに処理を分岐
		switch (`${request.method}/${pathArray[1]}`) {
			case 'GET/':
				try {
					// レスポンスの返却
					return new Response(`OK`);				
				} catch (error) {
					console.error(`👺 ${error}`);
					return new Response(`${error}`);
				}

			case 'GET/hello':
				try {
					// クエリーパラメータのチェック
					errors = [];
					const data = vs.applySchemaObject(QuerySchema, queryParams, errorHandler, () => {
						// エラーが発生するたびに errorHandler が呼ばれ、すべてのエラーチェックが終わったらerrorを投げる
						throw new Error(`👺 Parameter error. ${errors.join(', ')}`);
					});
	
					// レスポンスの返却
					return new Response(`Hello ${data.name} ! Age: ${data.age} Gender: ${data.gender}`);				
				} catch (error) {
					console.error(`👺 ${error}`);
					return new Response(`${error}`);
				}

			case 'POST/':
				try {
					// Bodyパラメータのチェック
					errors = [];
					const data = vs.applySchemaObject(RequestBodySchema, await request.json(), errorHandler, () => {
						// エラーが発生するたびに errorHandler が呼ばれ、すべてのエラーチェックが終わったらerrorを投げる
						throw new Error(`👺 Parameter error. ${errors.join(', ')}`);
					});
					
					// レスポンスの返却
					const result = JSON.stringify({
						url: request.url,
						path: pathArray[1],
						key1: data.key1,
						key2: data.key2,
						key3: data.key3,
					});
					return new Response(result, {
						headers: {
							'content-type': 'application/json;charset=UTF-8',
						},
					})
				} catch (error) {
					console.error(`👺 ${error}`);
					return new Response(`${error}`);
				}

			default:
				throw new Error(`${request.method} is not supported.`);
		}
	},
};
