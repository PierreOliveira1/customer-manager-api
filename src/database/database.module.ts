import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

async function createPool(config: ConfigService) {
	try {
		const connectionString = config.get('DATABASE_URI');
		const pool = new Pool({
			connectionString,
		});

		pool.on('connect', () => {
			console.log('Conectado ao PostgreSQL');
		});

		pool.on('error', (err) => {
			console.error('Erro na conexão com o PostgreSQL:', err);
		});

		process.on('beforeExit', async () => {
			await pool.end();
			console.log('Desconectado do PostgreSQL');
		});

		await pool.connect();

		return pool;
	} catch (err) {
		console.error('Erro na conexão com o PostgreSQL:', err);
		throw err;
	}
}

const service: Provider = {
	provide: 'POSTGRES',
	useFactory: createPool,
	inject: [ConfigService],
};

@Global()
@Module({
	providers: [service],
	exports: [service],
})
export class DatabaseModule {}
