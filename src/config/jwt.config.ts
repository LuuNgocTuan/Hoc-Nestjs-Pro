import ms from 'ms';
import type { StringValue } from 'ms';

export default () => {
    const accessRaw = process.env.JWT_ACCESS_TOKEN_EXPIRE!;
    const refreshRaw = process.env.JWT_REFRESH_TOKEN_EXPIRE!;

    return {
        jwt: {
            accessExpire: ms(accessRaw as StringValue),
            refreshExpire: ms(refreshRaw as StringValue),
        },
    };
};