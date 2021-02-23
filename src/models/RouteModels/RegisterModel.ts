import User from "../DatabaseHandler";
import Validator from "../Methods/Validators/RegisterValidator";

export default class RegisterHandler {
  private _clientData;

  constructor(clientData) {
    this._clientData = clientData.body;
  }

  /**
   * Registers a new user
   */
  public register(callback) {
    let regVal = new Validator();

    regVal.login = this._clientData.login;
    regVal.mail = this._clientData.mail;
    regVal.password = this._clientData.password;

    regVal.validate(regVal, (errors) => {
      if (errors)
        return callback(0, `ERR_INCORRECT_${errors[0].toUpperCase()}`, null);
      else {
        User.getUserInfoByLogin({ login: regVal.login }, (err, user) => {
          if (err) throw err;
          if (user) return callback(0, `ERR_USER_ALREADY_EXISTS`, null);
          else {
            User.getQueryUserInfo({ mail: regVal.mail }, (err, userArr) => {
              if (err) throw err;
              if (userArr.length !== 0) {
                return callback(0, `ERR_MAIL_ALREADY_IN_USE`, null);
              } else {
                User.addUser(regVal, (err, user) => {
                  if (err) throw err;
                  if (user) return callback(1, `SUCCESS`, null);
                });
              }
            });
          }
        });
      }
    });
  }
}
