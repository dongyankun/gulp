gulp前端流程化工具

前提 npm init -y
安装 npm i gulp -D
建立 gulpfile.js


使用注意四个api
	1.gulp.src(读取文件流)
		gulp.src('admin/**/*.js')//读取admin目录下所有js文件
		gulp.src('admin/*')//读取admin目录下所有文件
	2.gulp.task(gulp任务)
		gulp.task('default',function(){

		})
		//默认运行default任务，直接运行gulp

		gulp.src('default',['task1','task2'],function(){

		})
		//运行default任务前，执行task1和task2任务

		命令行 gulp '任务名'，执行任务 
	3.gulp.dest(gulp写入文件流)
		gulp.dest('dist')
		//gulp.dest(path)生成的文件路径是我们传入的path参数后面再加上gulp.src()中有通配符开始出现的那部分路径
		举例子
		gulp.src('script/**/*.js')
    		.pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/**/*.js//如果 **/*.js 匹配到的文件为 jquery/jquery.js ,则生成的文件路径为 dist/jquery/jquery.js
		gulp.src('script/avalon/avalon.js') //没有通配符出现的情况
		    .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/avalon.js

		//有通配符开始出现的那部分路径为 **/underscore.js
		gulp.src('script/**/underscore.js')
		    //假设匹配到的文件为script/util/underscore.js
		    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/util/underscore.js

		gulp.src('script/*') //有通配符出现的那部分路径为 *
		    //假设匹配到的文件为script/zepto.js    
		    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/zepto.js
	4.gulp.watch
		gulp.watch('js/**/*.js', function(event){
		    console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变
		    console.log(event.path); //变化的文件的路径
		});
		一般这么用，监听文件，执行任务
		gulp.watch('admin/*.html', ['html']);
gulp 的一些插件
	1.压缩js
		npm i gulp-uglify -D
		使用:
			let minifyJs= require('gulp-uglify')
			let gulp = require('gulp')
		//结合重命名js
			let gulpRename= require('gulp-rename')
		gulp.task('minifyJs',function(){
			gulp.src('admin/**/*.js')//读取文件流
				.pipe(minifyJs())//压缩
				.pipe(gulpRename({suffix:'.min'}))//添加后缀
				.pipe(gulp.dest('dist'))//输出文件流
		})
	2.压缩css
		npm i gulp-minify-css -D
		使用:
		let minifyCss= require('gulp-minify-css')
		let gulp = require('gulp')
		gulp.task('minifyCss',function(){
			gulp.src('admin/**/*.css')
				.pipe(minifyCss())
				.pipe(gulp.dest('dist'))
		})
	3.压缩html
		npm i gulp-minify-html -D
		使用:
		let minifyHtml= require('gulp-minify-html')
		let gulp = require('gulp')
		gulp.task('minifyHtml',function(){
			gulp.src('admin/**/*.js')
				.pipe(minifyHtml())
				.pipe(gulp.dest('dist'))
		})
	4.重命名文件名
		npm i gulp-rename -D
		使用:
		let gulpRename= require('gulp-rename')
		let gulp = require('gulp')
		gulp.task('gulpRename',function(){
			gulp.src('admin/js/1.js')
				.pipe(gulpRename('2.js'))
				.pipe(gulp.dest('dist/js'))
		})
	5.文件合并
		npm i gulp-concat -D
		let concatJs = require('gulp-concat')
		let gulp = require('gulp')
		gulp.task('concatJs',function(){
			gulp.src('admin/js/*.js')
				.pipe(concatJs('js/all.js'))
				.pipe(gulp.dest('dist'))
		})
	6.图片压缩
		npm i gulp-imagemin -D
		使用
		let minifyImg = require('gulp-imagemin')
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
	7.sass编译,编译成css，引用css就可以
		npm i gulp-sass -D
		使用
		let gulpSass = require('gulp-sass')
		gulp.task('gulpSass',function(){
			gulp.src('admin/sass/*.scss')
				.pipe(gulpSass())
				.pipe(gulp.dest('dist/sass'))
		})
	8.js代码检查
		npm i jshint gulp-jshint -D //注意，必须安装jshint
		var gulp = require('gulp'),
	    jshint = require("gulp-jshint");
		gulp.task('jsLint', function () {
		    gulp.src('js/*.js')
		    .pipe(jshint())
		    .pipe(jshint.reporter()); // 输出检查结果
		});
	9.自动侦听修改
		var gulp = require('gulp'),
		    livereload = require('gulp-livereload');
		
		gulp.task('minifyHtml',function(){
			gulp.src('admin/**/*.html')
				.pipe(minifyHtml())
				.pipe(gulp.dest('dist'))
				.pipe(livereload());//添加的
		})
		gulp.task('watch', function() {
		  livereload.listen();//添加的
		  gulp.watch('admin/*.html', ['minifyHtml']);
		});
	10.自动加载插件
		gulp-load-plugins
		//不想用，想看文档去https://www.npmjs.com/
	11.添加浏览器前缀
		安装
		npm i gulp-autoprefixer -D
		使用
		const gulp = require('gulp');
		const autoprefixer = require('gulp-autoprefixer');
		 
		gulp.task('default', () =>
		    gulp.src('src/app.css')
		        .pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
		        }))
		        .pipe(gulp.dest('dist'))
		);
	12.清理文件夹
		安装
			npm i gulp-clean -D
		使用
			let clean = require('gulp-clean')
			gulp.task('clean',function(){
				gulp.src('dist/')
					.pipe(clean())
			})
			//运行server前清理
			gulp.task('default',['clean'],function(){
				gulp.start(['server'])
			})
	13编译es6
		安装
			npm install --save-dev gulp-babel @babel/core @babel/preset-env
		使用
		const gulp = require('gulp');
		const babel = require('gulp-babel');
		 
		gulp.task('default', () =>
		    gulp.src('src/app.js')
		        .pipe(babel({
		            presets: ['@babel/env']
		        }))
		        .pipe(gulp.dest('dist'))
		);
注意为解决问题gulp3
	let rev = require('gulp-rev')
	let revCollector = require('gulp-rev-collector')
	.pipe(rename({suffix:'.min'}))

	添加后缀后，或者加上hash后，无法改变html中路径问题