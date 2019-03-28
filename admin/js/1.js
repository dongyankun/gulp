"use strict";
console.log(1);
class nihao{
  constructor(name) {
		this.name=name;
	}
	getName(){
		console.log(this.name)
	}
}
let newNihao = new nihao('xiaoming');
newNihao.getName();