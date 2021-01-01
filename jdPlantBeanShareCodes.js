/*
京东种豆得豆互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写东东萌宠的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 PLANT_BEAN_SHARECODES(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间按Cookie隔开方法,即用&符号隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let PlantBeanShareCodes = [
  // 'xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm@olmijoxgmjutzc3rvbnp5b7kahln5bfydvdvqva',//账号一的好友shareCode,不同好友中间用@符号隔开
  // 'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@6dygkptofggtp6ffhbowku3xgu',//账号二的好友shareCode，不同好友中间用@符号隔开
  'xvmz36xlz4egpqokgfkupb77ze@olmijoxgmjutzc3rvbnp5b7kahln5bfydvdvqva@jecu6w7qbrqulexj5f4eepaebm',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@tdgojfjehwryixkqojijz2rdaf5kjrm6zhpefkq',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@olmijoxgmjutze7hd76yen3wocmpdxm2jft3cby@olmijoxgmjutzc3rvbnp5b7kahln5bfydvdvqva',
  'tdgojfjehwryixkqojijz2rdaf5kjrm6zhpefkq@xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@jecu6w7qbrqulexj5f4eepaebm',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm',
  'olmijoxgmjutze7hd76yen3wocmpdxm2jft3cby@xvmz36xlz4egpqokgfkupb77ze@xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm',
  'tdgojfjehwryixkqojijz2rdaf5kjrm6zhpefkq@xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze',
  'tdgojfjehwryixkqojijz2rdaf5kjrm6zhpefkq@xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm',
  'xzvixhxjyibm2bkqdet2oet5svwoe4qjgcrwnvi@xvmz36xlz4egpqokgfkupb77ze@jecu6w7qbrqulexj5f4eepaebm'

]


// 判断github action里面是否有东东萌宠互助码
if (process.env.PLANT_BEAN_SHARECODES && process.env.PLANT_BEAN_SHARECODES.split('&') && process.env.PLANT_BEAN_SHARECODES.split('&').length > 0) {
  PlantBeanShareCodes = process.env.PLANT_BEAN_SHARECODES.split('&');
}
for (let i = 0; i < PlantBeanShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PlantBeanShareCodes' + index] = PlantBeanShareCodes[i];
}