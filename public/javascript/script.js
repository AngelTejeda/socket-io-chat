class Message {
  constructor(user, text, date, id = null) {
    this.id = id !== null ? id : this.generateGUID();
    this.user = user;
    this.text = text;
    this.date = date;
  }

  generateGUID() {
    function s4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}