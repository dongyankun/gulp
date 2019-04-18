let gulp = require('gulp')
let minifyJs = require('gulp-uglify')//压缩js
let minifyCss = require('gulp-minify-css')
let minifyHtml = require('gulp-minify-html')
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
//压缩js
gulp.task('minifyJs',function(){
	gulp.src('admin/**/*.js')
		.pipe(minifyJs())
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
})
//css文件压缩
gulp.task('minifycss',function(){
	gulp.src('admin/**/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
})
//HTML文件压缩
gulp.task('minifyHtml',function(){
	gulp.src('admin/**/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'))
		//.pipe(livereload());
		.pipe(reload({stream: true}));
})
//静态服务器
gulp.task('browserSync',function(){
	browserSync.init({
		server:{
			baseDir:"./dist/"
		}
	})
})
//代理,适合手机端浏览
gulp.task('browserSync2',function(){
	browserSync.init({
		server:{
			proxy:"192.168.0.64",
			baseDir:"./dist/"
		}
	})
})
//监听css,html文件
gulp.task('server',['minifyHtml','minifycss','minifyJs'],function(){
	browserSync.init({
		server:{
			baseDir:"./dist/"
		}
	})
	gulp.watch("admin/*.html",['minifyHtml'])
  	gulp.watch('admin/**/*.css', ['minifycss']);
  	gulp.watch('admin/**/*.js', ['minifyJs']);
})