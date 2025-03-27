import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    MONGO_URI: get('MONGO_URI').required().asString(),
    JWT_SECTRET: get('JWT_SECTRET').required().asString(),
    API_WHEATHER: get('API_KEY_WHEATER').required().asString(),
    PORT: get('PORT').required().asPortNumber(),
}
