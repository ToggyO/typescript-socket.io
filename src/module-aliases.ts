/**
 * Description: Module alias path resolver
 */

import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  db: __dirname + '/db',
  config: __dirname + '/config',
  constants: __dirname + '/constants',
  modules: __dirname + '/modules',
  services: __dirname + '/services',
  utils: __dirname + '/utils',
});
