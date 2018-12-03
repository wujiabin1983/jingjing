import Mock from 'mockjs'

const List = []
const count = 4
const cardtype = ['钻石卡', '金卡', '银卡', '普卡']
const renshu = ['1231', '2741', '5631', '5432']
const shouru = ['229000', '139712', '338871', '987265']
const zhanbi = ['15%', '25%', '35%', '40%']
const kedian = ['2350', '1590', '899', '699']
const jiandian = ['1999', '1299', '699', '399']
const liandai = ['2.1', '1.5', '1.5', '1.8']

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    cardtype: cardtype[i],
    renshu: renshu[i],
    shouru: shouru[i],
    zhanbi: zhanbi[i],
    kedian: kedian[i],
    jiandian: jiandian[i],
    liandai: liandai[i]
  }))
}

export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  }
}
