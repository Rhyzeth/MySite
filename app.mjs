import createError from 'http-errors';
import express, { json, urlencoded, static as expressStatic } from 'express';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Liquid } from 'liquidjs'

import indexRouter from './routes/index.mjs';
import usersRouter from './routes/users.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const engine = new Liquid({
  root: dirname,
  extname: '.liquid'
})

// view engine setup
app.engine('liquid', engine.express())
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'liquid');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressStatic(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
