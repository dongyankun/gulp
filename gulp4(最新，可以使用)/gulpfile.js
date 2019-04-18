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
let babel = require('gulp-babel')

//压缩js
gulp.task('minifyJs',function(){
	return gulp.src('admin/**/*.js')
		
		.pipe(babel({
            presets: ['@babel/env']
        }))
  //       .pipe(jshint())//js代码检查
		// .pipe(jshint.reporter())//检查结果输出
		.pipe(minifyJs())//压缩js代码
		//.pipe(rename({suffix:'.min'}))//更改名字添加后缀,和加hash矛盾，并且加后缀不能自动替换，舍弃
		.pipe(rev())//添加hash,清除缓存
		.pipe(gulp.dest('dist'))//输出js
		.pipe(rev.manifest())//生成json
		.pipe(gulp.dest('admin/js'))//输出json
})
//css文件压缩,添加浏览器前缀
gulp.task('minifycss',function(){
	return gulp.src('admin/**/*.css')
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))//添加浏览器后缀
		.pipe(minifyCss())//压缩
		.pipe(rev())//添加hash,清除缓存
		.pipe(gulp.dest('dist'))
		.pipe(rev.manifest())//生成json
		.pipe(gulp.dest('admin/css'))//输出json
})
//HTML文件压缩
gulp.task('minifyHtml',function(){
	return gulp.src('admin/**/*.html')
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'))
})
//文件合并，不能自动更改htnl路径，舍弃
gulp.task('concatAll',function(){
	return gulp.src('admin/js/*.js')
		.pipe(concatAll('js/all.js'))
		.pipe(gulp.dest('dist'))
})
//image压缩
gulp.task('imagemin',function(){
	return gulp.src('admin/images/*')
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
		.pipe(rev())//添加hash,清除缓存
		.pipe(gulp.dest('dist/images'))
		.pipe(rev.manifest())//生成json
		.pipe(gulp.dest('admin/images'))//输出json
})
//sass编译
gulp.task('gulpSass',function(){
	return gulp.src('admin/sass/*.scss')
		.pipe(gulpSass())//编译为css
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))//添加浏览器后缀
        .pipe(rev())//添加hash,清除缓存
		.pipe(gulp.dest('dist/sass'))//输出
		.pipe(rev.manifest())//生成json
		.pipe(gulp.dest('admin/sass'))//输出json
})
//hash替换
gulp.task('rev', function() {
    return gulp.src(['admin/**/*.json', 'dist/*.html'])
        .pipe(revCollector({
            replaceReved: true,//允许替换, 已经被替换过的文件
            // dirReplacements: {
            //     'css': '/dist/css',
            //     'js': '/dist/js'
            // }
        }))
        .pipe(gulp.dest('dist'));
});
//监听css,html文件
gulp.task('server',function(){
	browserSync.init({
		server:{
			baseDir:"./dist/"
		}
	})
	gulp.watch(["admin/*.html",'admin/**/*.css','admin/**/*.scss','admin/**/*.js'],gulp.series('clean','minifyHtml','minifycss','minifyJs','imagemin','gulpSass','rev'))
})
//清理dist文件夹
gulp.task('clean',function(){
	return gulp.src('dist/')
		.pipe(clean())
})
gulp.task('default',gulp.series('clean','minifyHtml','minifycss','minifyJs','imagemin','gulpSass','rev','server'))