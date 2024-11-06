/*
Maybe we should just use a thunkMiddlewre.
thunkMiddleware allows you to pass in an async function as dispatch() argument
*/

export const streamHandlerMiddleware = store => next => action => {
    // given a stream
    if (action.stream === 'audio') { 

    } else if (action.stream === 'html5') {
        // action.payload would be SpeechRecognitionResultList

    } else if (action.stream === 'azure') {

    } else if (action.stream === 'userAction') {

    }
  
    // Otherwise, it's a normal action - send it onwards
    return next(action)
}