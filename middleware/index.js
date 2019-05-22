module.exports = {
  /*function thaht handles errors that are catch from our async await code*/
  errorHandler: fn => //this is high order function that returns anonimus function
    (req, res, next) => { //anonimus function takes req, res, next
      Promise.resolve(fn(req,res,next)) /*whatever promise returns we can call .then and .catch on.
                                          this function  fn(req,res,next) is our async function from controllers*/
             .catch(next) //catch pass next if we catch any error
    }
}
