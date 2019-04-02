var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minjs = require('gulp-uglify'),
    connect = require('gulp-connect');
    
var src="src/",
	dist="dist/";

gulp.task('minjs', function () {
    return gulp.src(src+'js/*.js')
        // .pipe(concat('all.js'))//合并js
        .pipe(minjs({
            mangle: true//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest(dist+'js'));
});

gulp.task('server', function() {
    connect.server({
        port: 8888
    });
    //connect.serverClose(); //关闭
    //connect.reload()//重启
});

gulp.task('watch', function () {
    gulp.watch(src+'js/*.js', ['minjs']);
});

gulp.task('default',['minjs']); //定义默认任务 
