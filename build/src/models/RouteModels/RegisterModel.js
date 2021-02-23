"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseHandler_1 = __importDefault(require("../DatabaseHandler"));
const RegisterValidator_1 = __importDefault(require("../Methods/Validators/RegisterValidator"));
class RegisterHandler {
    constructor(clientData) {
        this._clientData = clientData.body;
    }
    /**
     * Registers a new user
     */
    register(callback) {
        let regVal = new RegisterValidator_1.default();
        regVal.login = this._clientData.login;
        regVal.mail = this._clientData.mail;
        regVal.password = this._clientData.password;
        regVal.validate(regVal, (errors) => {
            if (errors)
                return callback(0, `ERR_INCORRECT_${errors[0].toUpperCase()}`, null);
            else {
                DatabaseHandler_1.default.getUserInfoByLogin({ login: regVal.login }, (err, user) => {
                    if (err)
                        throw err;
                    if (user)
                        return callback(0, `ERR_USER_ALREADY_EXISTS`, null);
                    else {
                        DatabaseHandler_1.default.getQueryUserInfo({ mail: regVal.mail }, (err, userArr) => {
                            if (err)
                                throw err;
                            if (userArr.length !== 0) {
                                return callback(0, `ERR_MAIL_ALREADY_IN_USE`, null);
                            }
                            else {
                                DatabaseHandler_1.default.addUser(regVal, (err, user) => {
                                    if (err)
                                        throw err;
                                    if (user)
                                        return callback(1, `SUCCESS`, null);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}
exports.default = RegisterHandler;
