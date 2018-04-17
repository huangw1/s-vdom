/**
 * Created by huangw1 on 2018/4/16.
 */

const type = (o) => Object.prototype.toString.call(o).match(/\[object\s+(.*)\]/)[1].toLowerCase()

export const isString = (str) => type(str) == 'string'
