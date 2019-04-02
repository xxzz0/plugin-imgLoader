var gulp = require('gulp'),
	rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    minjs = require('gulp-uglify'),
    mincss = require('gulp-minify-css'),
    minhtml = require('gulp-minify-html'),
    minimg = require('gulp-image'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer');
    
var src="src/",
	dist="dist/";

gulp.task('minjs', function () {
    return gulp.src(src+'js/*.js')
        .pipe(concat('all.js'))//合并js
        .pipe(minjs({
            mangle: true//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest(dist+'js'));
});

gulp.task('autoprefixer',()=>gulp.src(src+'css/*.css')
    .pipe(autoprefixer({
        browsers: ['last 20 versions'],//主流浏览器的最新20个版本
        cascade: false//是否美化属性值
    }))
    .pipe(gulp.dest(dist+'css'))
);

gulp.task('mincss', function () {
	return gulp.src(src+'css/*.css')
        .pipe(concat('all.css'))//合并css
        .pipe(mincss())
        .pipe(gulp.dest(dist+'css'));
});

gulp.task('minhtml', function () {
	return gulp.src(src+'*.html')
        .pipe(minhtml())
        .pipe(gulp.dest(dist));
});

gulp.task('minimg', function () {
	return gulp.src(src+'img/{*,**/*,**/**/*,**/**/**/*}.jpg')
        .pipe(changed(dist+'img'))//只压缩修改后的图片,地址和gulp.dest地址一样
        .pipe(minimg({
        	pngquant: true,
		    optipng: false,
		    zopflipng: true,
		    jpegRecompress: true,//jpg深度压缩
		    mozjpeg: true,
		    guetzli: false,
		    gifsicle: true,
		    svgo: true,
		    concurrent: 10
        }))
        .pipe(gulp.dest(dist+'img'));
});

gulp.task('minimg2', function () {
	return gulp.src(src+'img/*')
        .pipe(changed(dist+'img'))//只压缩修改后的图片,地址和gulp.dest地址一样
        .pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 7}),
		    imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
        .pipe(gulp.dest(dist+'img'));
});

gulp.task('connect', function() {
    connect.server({
        port: 8888
    });
    //connect.serverClose(); //关闭
    //connect.reload()//重启
});

gulp.task('watch', function () {
    gulp.watch(src+'js/*.js', ['minjs']);
    gulp.watch(src+'css/*.css', ['mincss']);
    gulp.watch(src+'*.html', ['minhtml']);
    gulp.watch(src+'img/*', ['minimg']);
});

gulp.task('default',['minjs', 'mincss','minhtml','minimg']); //定义默认任务 
