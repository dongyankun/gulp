let gulp = require('gulp')
let minifyJs = require('gulp-uglify')//压缩js
let rename = require('gulp-rename')
let minifyCss = require('gulp-minify-css')
let minifyHtml = require('gulp-minify-html')
let concatJs = require('gulp-concat')
let minifyImg = require('gulp-imagemin')
let gulpSass = require('gulp-sass')
let jshint = require('gulp-jshint')
let livereload = require('gulp-livereload');//自动编译
let autoprefixer = require('gulp-autoprefixer');
//压缩js
gulp.task('minifyJs',function(){
	gulp.src('admin/**/*.js')
		.pipe(minifyJs())
		.pipe(rename({suffix:'.min'}))//添加后缀
		.pipe(gulp.dest('dist'))
})
//重命名js
gulp.task('rename',function(){
	gulp.src('admin/js/1.js')
		.pipe(rename('24234.js'))
		.pipe(gulp.dest('dist'))
})
//css文件压缩,添加浏览器前缀
gulp.task('minifycss',function(){
	gulp.src('admin/**/*.css')
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(minifyCss())
		.pipe(gulp.dest('dist'))
})
//HTML文件压缩
gulp.task('minifyHtml',function(){
	gulp.src('admin/**/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'))
		.pipe(livereload());
})
//文件合并
gulp.task('concatJs',function(){
	gulp.src('admin/js/*.js')
		.pipe(concatJs('js/all.js'))
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
		.pipe(gulpSass())
		.pipe(gulp.dest('dist/sass'))
})
//检查js代码
gulp.task('jshint',function(){
	gulp.src('admin/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter())
})
//watch代码
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('admin/*.html', ['minifyHtml']);
  gulp.watch('admin/**/*.js', ['minifyJs']);
});
gulp.task('default',['minifyJs','minifycss','minifyHtml','imagemin','gulpSass'],function(){
	console.log('任务执行完了')
})