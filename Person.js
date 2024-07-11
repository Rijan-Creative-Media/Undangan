export default class Person {
	constructor(name, fullName, { preTitle, postTitle, father, mother, from } = {}) {
		this.name = name;
		this.fullName = fullName;
		this.father = father;
		this.mother = mother;
		this.preTitle = preTitle;
		this.postTitle = postTitle;
		this.from = from;
	}

	get nameWithTitle() {
		return this.preTitle + ' ' + this.name + ', ' + this.postTitle;
	}
	
	get fullNameWithTitle() {
		return this.preTitle + ' ' + this.fullName + ', ' + this.postTitle
	}
}