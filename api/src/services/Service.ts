class Service<R> {
    private readonly repo:R

    constructor(repository: R) {
        this.repo = repository;
    }

    /**
     * Returns the associated repository
     * @protected
     */
    protected repository(): R {
        return this.repo
    }



}

export default Service;