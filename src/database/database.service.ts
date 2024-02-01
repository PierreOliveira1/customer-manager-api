import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
	private pool: Pool;

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		await this.createPool();
	}

	async onModuleDestroy() {
		await this.closePool();
	}

	private async createPool() {
		try {
			const connectionString = this.configService.get('DATABASE_URI');
			this.pool = new Pool({
				connectionString,
			});

			this.pool.on('connect', () => {
				console.log('Conectado ao PostgreSQL');
			});

			this.pool.on('error', (err) => {
				console.error('Erro na conexão com o PostgreSQL:', err);
			});

			await this.pool.connect();
		} catch (err) {
			console.error('Erro na conexão com o PostgreSQL:', err);
			throw err;
		}
	}

	private async closePool() {
		if (this.pool) {
			await this.pool.end();
			console.log('Desconectado do PostgreSQL');
		}
	}

	getPool(): Pool {
		if (!this.pool) {
			throw new Error('Pool not initialized');
		}

		return this.pool;
	}
}
