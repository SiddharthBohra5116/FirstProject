module.exports =  (fn) => {
   return function(req,res,next) {
    fn(req,res,next).catch(next);  //If fn returns a promise that rejects (i.e., an error occurs), the .catch(next) part catches the error and passes it to the next function.
   } 
}