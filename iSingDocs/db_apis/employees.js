const oracledb = require('oracledb');
const database = require('../services/database.js');
const security = require('../services/security.js');
const connectionName = 'hr';

const baseQuery = 
 `select employee_id "id",
    first_name "first_name",
    last_name "last_name",
    email "email",
    phone_number "phone_number",
    hire_date "hire_date",
    job_id "job_id",
    salary "salary",
    commission_pct "commission_pct",
    manager_id "manager_id",
    department_id "department_id"
  from employees`;

const paginator = '\n' +
  `offset :offset rows
   fetch next :fetch rows only`;

function find(context) {
  return new Promise(function(resolve, reject) {
    let query;
    const binds = {};
    const orderParts = (context.order || 'employee_id:asc').split(':');
    let orderCol = security.assertSimpleSqlName(orderParts[0]);
    const orderDir = security.assertValidSortOrder(orderParts[1]);

    if (orderCol === 'id') {
      orderCol = 'employee_id';
    }

    binds.offset = context.offset || 0;
    binds.fetch = context.limit || 100;

    if (context.id) {  
      binds.employee_id = context.id;

      query = baseQuery +
        `\nwhere employee_id = :employee_id` + 
        `order by ${orderCol} ${orderDir}` +
        paginator;
    } else {
      query = baseQuery +
      `\norder by ${orderCol} ${orderDir}` +
      paginator;
    }
console.log(query);
    database.simpleExecute(connectionName, query, binds)
      .then(result => resolve(result.rows))
      .catch(reject);
  });
}

module.exports.find = find;

const createSql =
 `insert into employees (
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id
  ) values (
    :first_name,
    :last_name,
    :email,
    :phone_number,
    :hire_date,
    :job_id,
    :salary,
    :commission_pct,
    :manager_id,
    :department_id
  ) returning employee_id 
  into :employee_id`;

function create(employee) {
  return new Promise(function(resolve, reject) {
    employee.employee_id = {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }

    database.simpleExecute(connectionName, createSql, employee)
      .then(result => {
        employee.employee_id = result.outBinds.employee_id[0];

        resolve(employee);
      })
      .catch(reject);
  });
}

module.exports.create = create;

const updateSql =
 `update employees
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where employee_id = :employee_id`;

function update(employee) {
  return new Promise(function(resolve, reject) {
    database.simpleExecute(connectionName, updateSql, employee)
      .then(result => {
        resolve(employee);
      })
      .catch(reject);
  });
}

module.exports.update = update;

const deleteSql1 =
 `delete from job_history
  where employee_id = :employee_id`;

const deleteSql2 =
 `delete from employees
  where employee_id = :employee_id`;

function del(id) {
  return new Promise(function(resolve, reject) {
    let conn;
    let err;
    let binds = {
      employee_id : id
    };

    oracledb.getConnection(connectionName)
      .then(c => {
        conn = c;

        return conn.execute(deleteSql1, binds);
      })
      .then(() => {
        return conn.execute(deleteSql2, binds, {autoCommit: true});
      })
      .catch(e => err = e)
      .then(() => conn.close())
      .catch(console.log)
      .then(() => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

module.exports.delete = del;