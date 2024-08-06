import axios, { AxiosRequestConfig } from 'axios';
import { useCookieState } from 'ahooks';

// 定义请求方法类型
type HttpMethod = 'get' | 'post';
interface userType {
    email: string;
    username: string;
    id: number;
    avatar: string
}
// 定义请求配置类型
interface HttpApiConfig {
    route: string;
    data?: any;
    method?: HttpMethod;
    isToken?: boolean;
}
const ApiUrl = 'http://127.0.0.1:1337'
function HttpInitialize() {
    const [Cookis, SetCookis] = useCookieState('Authorization'); // 登录COOKIS
    function HttpApi({ route, data, method = 'get', isToken = false }: HttpApiConfig) {
        // 创建请求配置对象
        const config: AxiosRequestConfig = {
            method,
            url: ApiUrl + '/api/' + route,
            headers: {
                'Authorization': isToken ? `Bearer ${Cookis}` : '', // 携带认证令牌
                'Content-Type': 'application/json' // 设置请求内容类型为JSON
            },
            data: method === 'post' ? data : undefined // 仅在 POST 请求时携带 data
        };
        return axios(config)
    }
    return { HttpApi, SetCookis, isCookis: Cookis !== '' }
}


export {
    HttpInitialize,
    ApiUrl,
    HttpApiConfig,
    userType,
    HttpMethod
};
