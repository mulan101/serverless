'use strict';

var mysql = require('mysql');

const connection = mysql.createConnection({
    host     : "xxxxx",
    user     : "xxxxx",
    password : "xxxxx",
    database : "xxxxx"
});

connection.connect(function(err){
  if (err){
    console.log("-------------------- Error connect to DB --------------------");
    return;
  }
  console.log('-------------------- DB is connected ! ----------------------');
});

module.exports = {
  // 리스트 조회
  getNoticeList : (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false; 

    const sql = 'select id,title,contents,create_date,update_date from board';
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("error : " + error);
        throw error;
      }
      console.log("success : " + JSON.stringify(results));
      callback(
          null, 
          {
              statusCode: 200,
              headers: { 
                'Content-type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              }, 
              body: JSON.stringify(results)
          }
      );
    });
  },
  
  // 상세 조회
  getNotice : (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const sId = event.pathParameters.proxy;
    const sql = 'select id,title,contents,create_date,update_date from board where id = ?';
    const sqlParameter = [sId];
    
    connection.query(sql, sqlParameter,function (error, results, fields) {
      if (error) {
        throw error;
      }
      callback(
          null, 
          {
              statusCode: 200, 
              headers: { 
                'Content-type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              }, 
              body: JSON.stringify(results)
          }
      );
    });
  },
  
  // 생성
  createNotice : (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("request: " + JSON.stringify(event));
    var json = JSON.parse(new Buffer(event.body, 'base64').toString('ascii'));
    
    const sTitle = json.title;
    const sContents = json.contents;
    
    if(sTitle && sContents) {
      const sql = 'insert into board (title, contents, create_date) VALUES(?, ?, sysdate())';
      const sqlParameter = [sTitle, sContents];
      
      connection.query(sql, sqlParameter,function (error, results, fields) {
        if (error) {
          throw error;
        }
        callback(
            null, 
            {
                statusCode: 200, 
                headers: { 
                  'Content-type': 'application/json', 
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({result: "success"})
            }
        );
      });
    } else {
      callback(
            null, 
            {
                statusCode: 500,
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({result: "fail", input: json})
            }
        );
    }
  },
  
  // 수정
  updateNotice : (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const sId = event.pathParameters.proxy;
    var json = JSON.parse(event.body);
    const sTitle = json.title;
    const sContents = json.contents;
    
    if(sId && sTitle && sContents) {
      const sql = 'update sampledb.board set title = ?, contents = ?, update_date = sysdate() where id = ?';
      const sqlParameter = [sTitle, sContents, sId];
      
      connection.query(sql, sqlParameter,function (error, results, fields) {
        if (error) {
          throw error;
        }
        callback(
            null, 
            {
                statusCode: 200, 
                headers: { 
                  'Content-type': 'application/json', 
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true
                },
                body: "{result : success}"
            }
        );
      });
    } else {
      callback(
            null, 
            {
                statusCode: 500,
                headers: { 'Content-type': 'application/json' },
                body: "{result : fail}"
            }
        );
    }
  },
  
  // 삭제
  deleteNotice : (event, context, callback) => {
    const sId = event.pathParameters.proxy;
    const sql = 'delete from board where id = ?';
    const sqlParameter = [sId];
    
    connection.query(sql, sqlParameter,function (error, results, fields) {
      if (error) {
        throw error;
      }
      callback(
          null, 
          {
              statusCode: 200, 
              headers: { 
                'Content-type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
              body: "{result : success}"
          }
      );
    });
  }
  
}

