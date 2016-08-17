var gulp = require('gulp');
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var spritesmith = require("gulp.spritesmith");
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var rename = require("gulp-rename");
var notify = require( 'gulp-notify' );

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var csso = require('gulp-csso');

var uglify = require('gulp-uglify');
var del = require('del');
var ftp = require('gulp-ftp');
var gulpsync = require('gulp-sync')(gulp);

var config = {
    server: {
        baseDir: "dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

var config2 = {
    server: {
        baseDir: "dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('tunnel', function () {
    browserSync(config2);
});


gulp.task('html', function() {
    gulp.src('./src/*.html')
  .pipe(gulp.dest("./dist"));         
});


gulp.task('reload', function() {
   gulp.src('dist/*.html')
 .pipe(reload({stream: true}))        
});

gulp.task('css', ['sass'], function () {   
 gulp.src('tmp/css/*.css')
    .pipe(autoprefixer('last 20 versions','> 1%', 'IE 8'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream: true}))

});

gulp.task('sass', function () {
   return  gulp.src('src/scss/main.scss')
    .pipe(sass().on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "Sass Error!"
      } )
 ))
    .pipe(gulp.dest('tmp/css'))   
});

gulp.task('js', function () {  
gulp.src('src/js/*.js')
    .pipe(uglify().on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "Sript Error!"
      } )
 ))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream: true}))
});


gulp.task('img', function () {  
gulp.src('src/image/*.*')
    .pipe(imagemin(""))
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
})))
    .pipe(gulp.dest('dist/image'))
    .pipe(reload({stream: true}))
});

gulp.task('watch', function(){
    gulp.watch('src/scss/*.*',['css'])
    gulp.watch('src/*.html',['html'])
    gulp.watch('dist/*.html',['reload'])
    gulp.watch('src/js/*.js',['js'])
     gulp.watch('src/image/*.*',['img'])
 });

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('src/image/sprite/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                algorithm: 'binary-tree',
                padding : 10
            }));

    spriteData.img.pipe(gulp.dest('dist/image/')); 
    spriteData.css.pipe(gulp.dest('src/scss/'));
});

gulp.task('clean', del.bind(null, ['tmp', 'dist/*.html', 'dist/css','dist/js','dist/image']));

gulp.task('ftp2', function() {
 return gulp.src('dist/**/*.*')
   .pipe(ftp({
     host: 'www.zzz.com.ua',
     remotePath: '',
     port: 21,
     user: 'admin@kos.zzz.com.ua',
     pass: '29011979'
   }));
});

gulp.task('ftp', function() {
 return gulp.src('dist/**/*.*')
   .pipe(ftp({
     host: 'workincode.pe.hu',
     remotePath: '/public_html',
     port: 21,
     user: 'u305334178',
     pass: '29011979'
   }));
});

gulp.task('build', gulpsync.sync(['html', 'css',"img","js"]))
gulp.task('serve', gulpsync.sync(['clean','build','webserver', "watch"]))
gulp.task('default', gulpsync.sync(['clean', 'build']))
gulp.task('deploy_zzz', ['ftp2']);
gulp.task('deploy_incode', ['ftp']);
