let gulp = require('gulp')
let minifyJs = require('gulp-uglify')//压缩js
let rename = require('gulp-rename')
let minifyCss = require('gulp-minify-css')
let minifyHtml = require('gulp-minify-html')
let concatAll = require('gulp-concat')
let minifyImg = require('gulp-imagemin')
let gulpSass = require('gulp-sass')
let jshint = require('gulp-jshint')
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
let clean = require('gulp-clean')
let rev = require('gulp-rev')
let revCollector = require('gulp-rev-collector')

//压缩js
gulp.task('minifyJs',function(){
	gulp.src('admin/**/*.js')
		.pipe(jshint())//js代码检查
		.pipe(jshint.reporter())//检查结果输出
		.pipe(minifyJs())//压缩js代码
		//.pipe(rename({suffix:'.min'}))//更改名字添加后缀
		//.pipe(rev())//添加hash,清除缓存
		.pipe(gulp.dest('dist'))//输出js
		//.pipe(rev.manifest())//生成json
		//.pipe(gulp.dest('dist'))//输出json
})
//css文件压缩,添加浏览器前缀
gulp.task('minifycss',function(){
	gulp.src('admin/**/*.css')
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))//添加浏览器后缀
		.pipe(minifyCss())//压缩
		.pipe(gulp.dest('dist'))
})
//HTML文件压缩
gulp.task('minifyHtml',function(){
	gulp.src('admin/**/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'))
})
//文件合并
gulp.task('concatAll',function(){
	gulp.src('admin/js/*.js')
		.pipe(concatAll('js/all.js'))
		.pipe(gulp.dest('dist'))
})
//image压缩
gulp.task('imagemin',function(){
	gulp.src('admin/images/*')
		.pipe(minifyImg([
			minifyImg.gifsicle({interlaced: true}),
			minifyImg.jpegtran({progressive: true}),
			minifyImg.optipng({optimizationLevel: 5}),
			minifyImg.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest('dist/images'))
})
//sass编译
gulp.task('gulpSass',function(){
	gulp.src('admin/sass/*.scss')
		.pipe(gulpSass())//编译为css
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))//添加浏览器后缀
		.pipe(gulp.dest('dist/sass'))//输出
})

//监听css,html文件
gulp.task('server',['minifyHtml','minifycss','minifyJs','imagemin','gulpSass'],function(){
	browserSync.init({
		server:{
			baseDir:"./dist/"
		}
	})
	gulp.watch("admin/*.html",['minifyHtml'])
  	gulp.watch('admin/**/*.css', ['minifycss']);
  	gulp.watch('admin/**/*.scss', ['gulpSass']);
  	gulp.watch('admin/**/*.js', ['minifyJs']);
})
//清理dist文件夹
gulp.task('clean',function(){
	gulp.src('dist/')
		.pipe(clean())
})
gulp.task('default',['clean'],function(){
	gulp.start(['server'])
})