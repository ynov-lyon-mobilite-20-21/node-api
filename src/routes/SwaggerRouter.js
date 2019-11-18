const Router = require('./Router');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(`${__dirname}/../swagger.yaml`);


class SwaggerRouter extends Router{

    constructor () {
        super();

        this.get({
            endpoint: '/docs',
            callback: swaggerUi.setup(swaggerDocument)
        });
    }


}

module.exports = new SwaggerRouter();
