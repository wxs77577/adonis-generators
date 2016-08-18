'use strict';

/**
* Adapted from
* adonis-commands
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseGenerator = require('./Base');
const path = require('path');
const i = require('inflect');

class ModelGenerator extends BaseGenerator {

  /**
   * returns signature to be used by ace
   * @return {String}
   *
   * @public
   */
  get signature() {
    const migrationsFlag = '{-m,--migration?:Create migration for a given model}';

    return `make:model {name} ${migrationsFlag}`;
  }

  /**
   * returns description to be used by ace as help command
   * @return {String}
   *
   * @public
   */
  get description() {
    return 'Create a new model with optional migration';
  }

  /**
   * handle method will be executed by ace. Here we
   * create the model to models directory.
   * @param  {Object} args
   * @param  {Object} options
   *
   * @public
   */
  * handle(args, options) {
    const name = args.name;
    const entity = this._makeEntityName(name, 'model', false, 'singular');
    const toPath = path.join(this.helpers.appPath(), 'Model', `${entity.entityPath}.js`);
    const template = options.template || 'model';
    const templateOptions = {
      name: entity.entityName,
      table: options.table,
      connection: options.connection,
    };

    try {
      yield this.write(template, toPath, templateOptions);
      this._success(toPath);
      this._createMigration(options, name);
    } catch (e) {
      this._error(e.message);
    }
  }

  /**
   * creates migration for corresponding model, if
   * options.migration is defined.
   *
   * @param  {Object} options
   * @param  {String} name
   *
   * @private
   */
  _createMigration(options, name) {
    if (options.migration) {
      const templateOptions = {
        connection: options.connection,
        create: options.table || i.pluralize(i.underscore(name)),
      };
      this.run('make:migration', [name], templateOptions);
    }
  }

}

module.exports = ModelGenerator;
