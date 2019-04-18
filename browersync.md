Browsersync能让浏览器实时、快速响应您的文件更改（html、js、css、sass、less等）并自动刷新页面。

安装
npm i browser-sync -D
使用:实现重载js,css,html
	
	let browserSync = require('browser-sync').create();//创建
	let reload = browserSync.reload;//重载
	//引入压缩js,css,html
	let minifyCss = require('gulp-minify-css')
	let minifyHtml = require('gulp-minify-html')
	let concatJs = require('gulp-concat')
	//压缩js
	gulp.task('minifyJs',function(){
		gulp.src('admin/**/*.js')
			.pipe(minifyJs())
			.pipe(gulp.dest('dist'))
			.pipe(reload({stream: true}));//添加的
	})
	//css文件压缩
	gulp.task('minifycss',function(){
		gulp.src('admin/**/*.css')
			.pipe(minifyCss())
			.pipe(gulp.dest('dist'))
			.pipe(reload({stream: true}));//添加的
	})
	//HTML文件压缩
	gulp.task('minifyHtml',function(){
		gulp.src('admin/**/*.html')
			.pipe(minifyHtml())
			.pipe(gulp.dest('dist'))
			//.pipe(livereload());
			.pipe(reload({stream: true}));//添加的
	})
	//监听变化,自动重载
	gulp.task('server',['minifyHtml','minifycss','minifyJs'],function(){
		browserSync.init({
			server:{
				baseDir:"./dist/",//项目目录,服务器
				//proxy:"192.168.0.64",//适合手机端浏览
			}
		})
		gulp.watch("admin/*.html",['minifyHtml'])
	  	gulp.watch('admin/**/*.css', ['minifycss']);
	  	gulp.watch('admin/**/*.js', ['minifyJs']);
	})
