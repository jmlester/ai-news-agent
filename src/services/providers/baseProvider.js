class BaseNewsProvider {
  constructor(name) {
    this.name = name;
  }

  async fetchArticles() {
    throw new Error('fetchArticles must be implemented by subclasses');
  }
}

module.exports = BaseNewsProvider;
