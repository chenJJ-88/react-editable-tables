interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
    // 模拟 API 调用
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                resolve({
                    success: true,
                    token: 'fake-jwt-token',
                });
            } else {
                resolve({
                    success: false,
                    message: '用户名或密码错误',
                });
            }
        }, 1000); // 模拟网络延迟
    });
};

