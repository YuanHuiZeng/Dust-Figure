/*
水果互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京东东农场的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 FruitShareCodes(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间按Cookie隔开方法,即用&符号隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let FruitShareCodes = [
    //辉159
    'bef4599371434daa9224957a7f33e363@2f040c396c3b4b43aa046c9cdbd340c5@4b7d4526a18d40abadc6534c0431c5a7@fde76ee19f904d05b626369585f1c9f5',
    //辉189
    '0abc572a1099426a966745426b80ef6a@a39d5367ef9f47b78ddd90e1b4e7b6e9@15392c89399349eb97d2f32b20786407@22cad41016bd415aa2fc98ceb7094df2',
    //娜159
    '06bcf8b1d8ab4509ae40c81848f56e93@2f040c396c3b4b43aa046c9cdbd340c5@fde76ee19f904d05b626369585f1c9f5@4b7d4526a18d40abadc6534c0431c5a7',
    //娜189
    '06bcf8b1d8ab4509ae40c81848f56e93@2f040c396c3b4b43aa046c9cdbd340c5@fde76ee19f904d05b626369585f1c9f5@4b7d4526a18d40abadc6534c0431c5a7',
    //三157
    'bef4599371434daa9224957a7f33e363@06bcf8b1d8ab4509ae40c81848f56e93@fde76ee19f904d05b626369585f1c9f5@4b7d4526a18d40abadc6534c0431c5a7',
    //三138
    'bef4599371434daa9224957a7f33e363@06bcf8b1d8ab4509ae40c81848f56e93@fde76ee19f904d05b626369585f1c9f5@4b7d4526a18d40abadc6534c0431c5a7',
    //新
    'bef4599371434daa9224957a7f33e363@2f040c396c3b4b43aa046c9cdbd340c5@06bcf8b1d8ab4509ae40c81848f56e93@4b7d4526a18d40abadc6534c0431c5a7',
    //老哥137
    'bef4599371434daa9224957a7f33e363@2f040c396c3b4b43aa046c9cdbd340c5@06bcf8b1d8ab4509ae40c81848f56e93@fde76ee19f904d05b626369585f1c9f5',
    //老哥189
    'bef4599371434daa9224957a7f33e363@2f040c396c3b4b43aa046c9cdbd340c5@06bcf8b1d8ab4509ae40c81848f56e93@fde76ee19f904d05b626369585f1c9f5',
    //丽华
    'bef4599371434daa9224957a7f33e363@2f040c396c3b4b43aa046c9cdbd340c5@06bcf8b1d8ab4509ae40c81848f56e93@4b7d4526a18d40abadc6534c0431c5a7',

    '0abc572a1099426a966745426b80ef6a@a39d5367ef9f47b78ddd90e1b4e7b6e9@15392c89399349eb97d2f32b20786407@22cad41016bd415aa2fc98ceb7094df2',

    '0abc572a1099426a966745426b80ef6a@a39d5367ef9f47b78ddd90e1b4e7b6e9@15392c89399349eb97d2f32b20786407@22cad41016bd415aa2fc98ceb7094df2',

    '0abc572a1099426a966745426b80ef6a@a39d5367ef9f47b78ddd90e1b4e7b6e9@15392c89399349eb97d2f32b20786407@22cad41016bd415aa2fc98ceb7094df2',
]
// 判断github action里面是否有水果互助码
if (process.env.FruitShareCodes && process.env.FruitShareCodes.split('&') && process.env.FruitShareCodes.split('&').length > 0) {
    FruitShareCodes = process.env.FruitShareCodes.split('&');
}
for (let i = 0; i < FruitShareCodes.length; i++) {
    const index = (i + 1 === 1) ? '' : (i + 1);
    exports['FruitShareCode' + index] = FruitShareCodes[i];
}