const router = require('express').Router();
const { body, param, query, validationResult } = require('express-validator');

class Router {

    constructor() {
        this.router = router;
    }

    getRouter() {
        return this.router;
    }

    post({ endpoint, callback, requiredFields = [] }) {
        this.router.post(endpoint, this._typeValidation(requiredFields), (req, res) => {
            this._routeCallback(req, res, callback);
        });
    }

    get({ endpoint, callback, requiredFields = [] }) {
        this.router.get(endpoint, this._typeValidation(requiredFields), (req, res) => {
            this._routeCallback(req, res, callback).bind(this);
        });
    }

    put({ endpoint, callback, requiredFields = [] }) {
        this.router.put(endpoint, this._typeValidation(requiredFields), (req, res) => {
            this._routeCallback(req, res, callback).bind(this);
        });
    }

    delete({ endpoint, callback, requiredFields = [] }) {
        this.router.delete(endpoint, this._typeValidation(requiredFields), (req, res) => {
            this._routeCallback(req, res, callback).bind(this);
        });
    }

    _routeCallback(req, res, callback) {
        this.req = req;
        this.res = res;

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return this.response(422, null, { validation: this._serializeValidationErrors(validationErrors.array()) })
        }

        callback(req, res);
    }

    _serializeValidationErrors(validationErrors) {
        return validationErrors.map( error => ({
            code: 'INVALID_VALUE',
            message: `Invalid value for required parameter ${error.param} of type ${error.location}`,
            param: error.param,
            type: error.location
        }))
    }

    _formatValidation(validationFunction, field) {
        if (field.format === 'email') {
            return validationFunction(field.name).isEmail();
        }

        return validationFunction(field.name).exists();
    }

    _typeValidation(requiredFields) {
        return requiredFields.map( field => {
            if (field.type === 'param') {
                return this._formatValidation(param, field);
            }

            if (field.type === 'query') {
                return this._formatValidation(query, field);
            }

            return this._formatValidation(body, field);
        })
    }

    response(statusCode, data = {}, error = {}) {
        const successStatusCodes = [ 200 ];
        const success = successStatusCodes.indexOf(statusCode) !== -1;
        return this.res.status(statusCode).json({ success, data, error })
    }

}

module.exports = Router;
