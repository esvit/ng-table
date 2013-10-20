/*!
 * Editr.js
 *
 * Copyright 2013, Kasper Mikewicz - http://idered.pl/
 * Released under the MIT License
 * http://choosealicense.com/licenses/mit/
 *
 * Github:  http://github.com/idered/Editr.js/
 * Version: 2.3.0
 */

(function(w) {

    'use strict';

    var EditrInstances = EditrInstances || [];

    var Editr = function(opts) {

        EditrInstances.push(this);

        var self = this;

        // Editor
        var editor = $(opts.el);

        // Editor elements
        var el = {
            preview: {},
            editor: editor
        };

        // Default settings
        opts = $.extend({
            parsers: {
                'html': {
                    type: 'html',
                    extension: 'html',
                    fn: function(str, isEncoded) {
                        str = str
                            .replace(/body\b[^>]*>/, '<body><div class="body">')
                            .replace('</body>', '</body>');

                        str = __.obj('div').html(str);

                        str.find('script, link, style').remove();

                        if (!isEncoded) {

                            if (str.find('.body').length) {
                                str = str.find('.body').html();
                            } else {
                                str = str.html()
                            }

                            str = str
                            // replace multiple empty lines with one empty line
                            .replace(/[\r\n]+/gi, '\n')
                            // remove first and last empty line
                            .replace(/^[\r\n]|[\n\r]$/gi, '');
                        } else {
                            str = str.html();
                        }

                        return str;
                    }
                },
                'css': {
                    type: 'css',
                    extension: 'css',
                    fn: function(str) {
                        return str;
                    }
                },
                'js': {
                    type: 'js',
                    extension: 'js',
                    fn: function(str) {
                        return str;
                    }
                },
                'less': {
                    type: 'css',
                    extension: 'less',
                    fn: function(str) {
                        var parser = new(less.Parser),
                            parsed = '',
                            error;

                        parser.parse(str, function(err, tree) {
                            if (err) {
                                error = err;
                                return err;
                            }
                            parsed = tree.toCSS();
                        });

                        return error || parsed;
                    }
                },
                'coffee': {
                    type: 'js',
                    extension: 'coffee',
                    fn: function(str) {
                        return CoffeeScript.compile(str);
                    }
                }
            },

            // Link to Gist proxy file
            gistProxyURL: '/editr/libs/proxy.gist.php',

            // Default layout view
            view: 'single',

            // Default path to projects
            path: 'items',

            // ACE theme
            theme: 'monokai',

            // ACE read mode
            readonly: false,

            wrap: false,

            callback: function() {}
        }, opts);

        var htmlOpts = ['path', 'readonly', 'theme', 'view', 'wrap'];

        // Extend js options with options from html data- attributes
        for (var i = 0; i < htmlOpts.length; i++) {
            if (editor.data(htmlOpts[i])) {
                opts[htmlOpts[i]] = editor.data(htmlOpts[i]);
            }
        }

        // Remove trailing slash
        opts.path = opts.path.replace(/\/$/, '');

        // Project data - files, name, etc.
        var data = {
            gists: {},
            filesLoaded: 0,
            files: {
                html: [],
                css: [],
                js: []
            },
            activeItem: -1
        };

        var build = {
            /**
             * Compose Editr parts - nav, content, loader
             */
            ui: function() {
                el.editor.addClass('editr-view--' + opts.view);

                // Build bar
                el.bar = __.obj('header', {
                    class: 'editr__bar'
                }).appendTo(editor);

                // Build nav
                el.nav = build.nav().appendTo(el.bar);

                // Build content wrapper
                el.content = __.obj('div', {
                    class: 'editr__content'
                }).appendTo(editor);

                // Build preview iframe
                el.preview.frame = build.preview().appendTo(el.content);
            },

            /**
             * Build Editr nav
             * @return {object}
             */
            nav: function() {
                var navs = [];

                navs.push(build.navList('html', 'Result', 'result'));
                navs.push(build.navList('html', 'HTML'));
                navs.push(build.navList('css', 'CSS'));
                navs.push(build.navList('js', 'JavaScript'));

                return __.obj('ul', {
                    class: 'editr__nav'
                }).append(navs);
            },

            /**
             * Build single nav list
             * @param  {string} type
             * @param  {string} label
             * @return {string}
             */
            navList: function(type, label, pseudoType) {
                var files = data.files[type],
                    nav, subnav;

                // Create nav item with label and add subnav
                nav = __.obj('li', {
                    'data-type': pseudoType || type,
                    class: 'editr__nav-item' + (data.files[type].length > 1 ? ' is-dropped' : '')
                }).append(__.obj('span', {
                    class: 'editr__nav-label',
                    text: label
                })).append(__.obj('ul', {
                    class: 'editr__subnav'
                }));

                subnav = nav.find('.editr__subnav');

                // Add subnav items, exclude hidden
                for (var i = 0; i < files.length; i++) {
                    if (files[i].isHidden) {
                        continue;
                    }

                    subnav.append(__.obj('li', {
                        'data-id': i,
                        'data-type': pseudoType || type,
                        'data-extension': files[i].extension,
                        'data-is-encoded': files[i].isEncoded,
                        class: 'editr__nav-label',
                        text: files[i].filename
                    }));
                };

                return nav;
            },

            /**
             * Setup preview iframe, load preview of first html file
             */
            preview: function() {
                var index = data.files.html[0];

                return __.obj('iframe', {
                    class: 'editr__result',
                    name: 'editr_' + get.randomID(),
                    src: opts.path + '/index.html'
                }).load(function() {
                    el.preview.result = $(this);
                    el.preview.body = el.preview.result.contents().find('body');
                    el.preview.head = el.preview.result.contents().find('head');

                    // Clean iframe
                    //el.preview.result.contents().find('link, style, script').remove();

                    el.preview.body.empty();

                    // Add style holder
                    el.preview.head.append(__.obj('style', {
                        class: 'editr-stylesheet',
                        rel: 'stylsheet'
                    }));

                    // Build editors
                    el.editors = build.editors();
                });
            },

            /**
             * Compose editors
             */
            editors: function() {
                var editors = {},
                    file;

                // Loop through categories
                $.each(data.files, function(extension, files) {
                    $.each(files, function(id, file) {
                        editors[extension] = editors[extension] || [];

                        // Build editor and push it to file data
                        editors[extension].push(
                            data.files[extension][id].editor = build.editor(file, id)
                        );

                        get.fileContent(file);
                    });
                });

                return editors;
            },

            /**
             * Build ACE editor for file
             * @param  {object} file
             * @return {object}
             */
            editor: function(file, id) {
                var aceEditor,
                    textarea = __.obj('div', {
                        id: 'editr_' + get.randomID(),
                        class: 'editr__editor editr__editor--' + (file.type || file.extension)
                    }).appendTo(el.content);

                require("ace/ext/emmet");

                aceEditor = ace.edit(textarea.attr('id'));
                aceEditor.setTheme("ace/theme/" + opts.theme);
                aceEditor.getSession().setMode('ace/mode/' + (file.extension === 'js' ? 'javascript' : file.extension));
                aceEditor.getSession().setUseWrapMode(opts.wrap);
                aceEditor.setReadOnly(opts.readonly);
                aceEditor.setWrapBehavioursEnabled(true);
                aceEditor.setOption("enableEmmet", true);
                aceEditor.getSession().setUseWorker(false);

                aceEditor.on('change', _.debounce(function() {
                    if (data.activeItem !== -1) {
                        __.renderPreview(data.files.html[data.activeItem]);
                    }
                }, 250, false));

                return aceEditor;
            },
        };

        // Utils
        var __ = {
            /**
             * Wrapper for object createion
             * @param  {string}   type
             * @param  {object}   attrs
             * @param  {Function || Object} fn
             * @return {jQuery}
             */
            obj: function(type, attrs, fn) {
                return $('<' + type + '>', attrs).on(fn);
            },

            /**
             * Check if Editr editor is in panel view
             * @return {Boolean}
             */
            isPaneled: function() {
                return ['horizontal', 'vertical', 'cartesian'].indexOf(opts.view) != -1;
            },

            /**
             * Debounce fn from underscore source
             * @return {Function}
             */
            debounce: function(func, wait, immediate) {

                var timeout;

                return function debounced() {
                    var context = this,
                        args = arguments;

                    function delayed() {
                        if (!immediate)
                            func.apply(context, args);
                        timeout = null;
                    };

                    if (timeout)
                        clearTimeout(timeout);
                    else if (immediate)
                        func.apply(context, args);

                    timeout = setTimeout(delayed, wait || 100);
                };

            },

            /**
             * Wait until all files are loaded and fire passed fn
             * @param  {Function} fn
             * @return {Function}
             */
            whenReady: function(fn) {
                var timer = null;

                return function() {
                    var context = this,
                        args = arguments;

                    timer = setInterval(function() {
                        if (data.filesLoaded === data.filesTotal) {
                            fn.call(context, args);
                        }
                    }, 50);
                };
            },

            /**
             * Get length of object
             * @param  {object} obj
             * @return {Integer}
             */
            size: function(obj) {
                var size = 0,
                    key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            },

            /**
             * Check if fille is hidden
             * @param  {string}  filename
             * @return {Boolean}
             */
            isHidden: function(filename) {
                return filename.indexOf('!') === 0;
            },

            /**
             * Check if fille is a gist
             * @param  {string}  filename
             * @return {Boolean}
             */
            isGist: function(filename) {
                return filename.indexOf('$') === 0;
            },

            /**
             * Check if string is base64 encoded
             * @param  {string}  str
             * @return {Boolean}
             */
            isEncoded: function(str) {
                return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
            },

            /**
             * Returns base64 decoded data
             * @see http://phpjs.org/functions/base64_decode/
             * @param  {string} data
             * @return {string}
             */
            base64Decode: function(data) {
                var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    dec = "",
                    tmp_arr = [];

                if (!data) {
                    return data;
                }

                data += '';

                do {
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if (h3 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                } while (i < data.length);

                dec = tmp_arr.join('');

                return dec;
            },

            /**
             * Add file to global array
             * @param {String}  type       File type
             * @param {String}  filename
             * @param {Boolean} isDefault
             * @param {Boolean} isGistFile
             * @param {Integer}  gistID
             */
            addFile: function(type, filename, isDefault, isGistFile, gistID) {
                // Create single file object with defaults
                var file = {
                    content: '',
                    type: '',
                    isDefault: isDefault,
                    isGist: false,
                    isGistFile: isGistFile ? true : false,
                    gistID: gistID ? gistID : null
                };

                file.id = data.files[type].length;

                file.filename = filename;

                // Check if file should be hidden from navigation
                file.isHidden = __.isHidden(file.filename);

                if (file.isHidden) {
                    // Remove '!'
                    file.filename = file.filename.replace(/^\!/, '');
                }

                // Check if file is gist
                file.isGist = __.isGist(file.filename);

                if (file.isGist) {
                    // Remove '$'
                    file.filename = file.filename.replace(/^\$/, '');

                    var gistFiles = file.filename.split(','),
                        gistID = $.trim(gistFiles[0]);

                    if (!data.gists[gistID]) {
                        // Create empty object for gist data loaded later
                        data.gists[gistID] = {};
                    }

                    // Remove gist id so only filenames left
                    gistFiles.shift();

                    for (var i = 0; i < gistFiles.length; i++) {
                        __.addFile(type, $.trim(gistFiles[i]), false, true, gistID);
                    }

                    return;
                }

                //  Get parser
                file.parser = get.parser(file.filename);

                if (file.parser) {
                    // Remove parser name from filename
                    file.filename = file.filename.replace(file.parser + ':', '');
                }

                // Check if file is Base64 encoded
                // Gist can't be encoded
                file.isEncoded = file.isGist ? false : __.isEncoded(file.filename);

                if (!file.isGist && file.isEncoded) {
                    // File is encoded so filename is actualy a code
                    file.content = __.base64Decode(file.filename);

                    // Create a real name for file
                    file.filename = 'file ' + (i + 1) + '.' + type;
                }

                // Get file type - html, css or js
                if (file.parser) {
                    if (opts.parsers[file.parser]) {
                        file.type = opts.parsers[file.parser].type;
                    }

                    file.extension = file.parser;
                } else {
                    file.type = get.extension(file.filename);

                    file.extension = file.isEncoded ? type : file.type;
                }

                // Add file to global files array
                data.files[type].push(file);
            },

            /**
             * Callback for loaded files, parse their content
             * @param  {object} file
             * @param  {string} code
             */
            fileContentCallback: function(file, content) {
                if (file.isGistFile) {
                    file.content = data.gists[file.gistID].files[file.filename].content;
                }

                if (file.isEncoded || file.isGistFile || file.isDefault) {
                    content = file.content;
                }

                ++data.filesLoaded;

                if (data.filesLoaded === data.filesTotal) {
                    onLoaded.init();
                }

                if (file.extension === 'html') {
                    content = opts.parsers[file.extension].fn(content || file.content || '', file.isEncoded);
                }

                file.editor.session.setValue(content);
                file.editor.clearSelection();
            },

            renderPreview: function(file) {
                var fileCSS, fileJS;
                data.activeItem = file.id;

                if (!file) return;

                // Remove old css
                var styleHolder = el.preview.head.find('.editr-stylesheet').empty();

                // Add css
                for (var i = 0; i < data.files.css.length; i++) {
                    fileCSS = data.files.css[i];

                    // Remove css error flag
                    $(fileCSS.editor.container).removeClass('editr__editor--invalid').removeAttr('data-error');

                    try {
                        var css = opts.parsers[fileCSS.extension].fn(fileCSS.editor.getValue());

                        if (typeof css === 'object') {
                            throw css;
                        }

                        styleHolder.append(css);
                    } catch (e) {
                        $(fileCSS.editor.container).addClass('editr__editor--invalid').attr('data-error', e.message);
                    }
                }

                // Add HTML
                el.preview.body.html(
                    file.editor.getValue()
                );

                // Add js
                for (var j = 0; j < data.files.js.length; j++) {
                    fileJS = data.files.js[j];

                    // Remove js error flag
                    $(fileJS.editor.container).removeClass('editr__editor--invalid').removeAttr('data-error');

                    try {
                        el.preview.result[0].contentWindow.eval(
                            opts.parsers[fileJS.extension].fn(fileJS.editor.getValue())
                        );
                    } catch (e) {
                        $(fileJS.editor.container).addClass('editr__editor--invalid').attr('data-error', 'Error: ' + e.message);
                    }
                }
            }
        };

        // Getters
        var get = {
            /**
             * Get editr files
             * @param  {string} type
             * @param  {bool} withHidden
             * @return {array}
             */
            files: function(type, withHidden) {
                var files = editor.data('files-' + type) || '',
                    hiddenFilesTotal = 0;

                // Remove last ';'
                files.replace(/;$/, '');

                if (files) {
                    // Split files list to array
                    files = files.split(';');

                    for (var i = 0; i < files.length; i++) {
                        __.addFile(type, $.trim(files[i]));
                    }
                }

                // Check if all files are hidden
                for (var i = 0; i < data.files[type].length; i++) {
                    if (data.files[type][i].isHidden) {
                        hiddenFilesTotal++;
                    }
                }

                // All files hidden? add default empty file
                if (hiddenFilesTotal === data.files[type].length) {
                    __.addFile(type, 'index.' + type, true);
                }
            },

            /**
             * Load gist data
             * @param  {object} gist
             */
            gistsData: function(callback) {
                data.gistsLoaded = 0;

                if (__.size(data.gists) === 0) {
                    callback();
                    return;
                }

                for (var id in data.gists) {
                    $.ajax({
                        url: opts.gistProxyURL,
                        type: "POST",
                        data: {
                            id: id
                        },
                        success: function(response) {
                            console.log(response);
                            data.gists[response.id] = response;

                            ++data.gistsLoaded;

                            if (data.gistsLoaded === __.size(data.gists)) {
                                callback();
                            }
                        }
                    });
                }
            },

            /**
             * Load file content
             * @param  {ACE Editor} textarea
             * @param  {object} file
             */
            fileContent: function(file) {
                // If File is encoded or it's file from  gist then it's already loaded
                if (file.isEncoded || file.isGistFile || file.isDefault) {
                    __.fileContentCallback(file);
                    return;
                }

                $.ajax({
                    url: [opts.path, data.item, file.filename].join('/'),
                    success: function(response) {
                        __.fileContentCallback(file, response);
                    },
                    cache: false
                });
            },

            /**
             * Get parser name based on string
             * @param  {string} str
             * @return {string}
             */
            parser: function(str) {
                // Match base64 extension
                var result = str.match(/^(.*):/) || [];

                result = result[1];

                if (!result) {
                    result = get.extension(str);

                    // Check if extension is parser
                    if (['html', 'css', 'js'].indexOf(result) !== -1) {
                        result = null;
                    }
                }
                return result;
            },

            /**
             * Get ACE editor
             * @param  {string} type
             * @param  {int} id
             * @return {ACE }
             */
            editor: function(type, id) {
                return data.files[type][id].editor;
            },

            /**
             * Get hidden files
             * @param  {string} type
             * @return {array}
             */
            hiddenFiles: function(type) {
                var files = [];

                for (var i = 0; i < data.files[type].length; i++) {
                    if (data.files[type][i].isHidden) {
                        files.push(data.files[type][i]);
                    }
                }

                return files;
            },

            /**
             * Get extension from filename
             * @param  {string} filename
             * @return {string}
             */
            extension: function(filename) {
                if (!filename.length) {
                    return null;
                }

                // Match extension with dot
                filename = filename.match(/\.[0-9a-z]+$/i) || [];

                // Get first occurrence
                filename = filename[0] || '';

                // Remove dot
                filename = filename.substr(1);

                return filename;
            },

            /**
             * Return random ID
             * @return {string}
             */
            randomID: function() {
                var a, b = b || 16;
                return Array(a || 8).join(0).replace(/0/g, function() {
                    return (0 | Math.random() * b).toString(b)
                });
            }
        };

        // Files loaded? Good, fire calback
        var onLoaded = {
            init: function() {
                // Fire user callback
                opts.callback(self);

                editor.addClass('editr--loaded');

                onLoaded.bindNav();
            },

            /**
             * Bind actions for nav items
             */
            bindNav: function() {
                var tabs = el.nav.find('.editr__nav-item'),
                    navItems = tabs.find('.editr__subnav').children();

                tabs.children('.editr__nav-label').on('click', function() {
                    $(this).next().children().first().trigger('click');
                });

                navItems.on('click', function(event) {
                    var item = $(this),
                        file,
                        aceEditor;

                    event.preventDefault();

                    el.nav.find('.active').removeClass('active');

                    item.closest('.editr__nav-item').andSelf().addClass('active');

                    // Render preview
                    if (item.data('type') === 'result') {
                        __.renderPreview(data.files.html[item.data('id')]);

                        if (__.isPaneled()) {
                            el.preview.frame.addClass('active');
                        } else {
                            el.preview.frame.addClass('active').siblings().removeClass('active');
                        }
                    } else { // Show editor
                        aceEditor = get.editor(item.data('type'), item.data('id'));

                        $(aceEditor.container).addClass('active').siblings(__.isPaneled() ? '.editr__editor--' + item.data('type') : '').removeClass('active');

                        //aceEditor.focus();

                        aceEditor.resize();
                    }
                }).first().trigger('click');

                if (__.isPaneled()) {
                    var categories = ['html', 'css', 'js'];
                    for (var i = 0; i < categories.length; i++) {
                        for (var j = 0; j < categories[i].length; j++) {
                            if (!data.files[categories[i]][j].isHidden) {
                                $(data.files[categories[i]][j].editor.container).addClass('active');
                                break;
                            }
                        }
                    }
                }
            }
        };

        var init = function() {
            // Get project name
            data.item = editor.data('item');

            // Get project files
            get.files('html', true);
            get.files('css', true);
            get.files('js', true);

            // Count files
            data.filesTotal =
                data.files['html'].length +
                data.files['css'].length +
                data.files['js'].length;

            get.gistsData(function() {
                build.ui();
            });
        };

        // Kick it off
        init();


        /**
         * API
         *=================================================*/

        // Bind Editr DOM element
        this.editor = editor;

        /**
         * Check if Editr is fully loaded
         * @return {Boolean}
         */
        this.isReady = function() {
            return data.filesLoaded === data.filesTotal;
        };

        /**
         * Return gists array
         * @return {Object}
         */
        this.getGists = function() {
            return data.gists;
        };

        /**
         * Return all files for given type or overall if not passed
         * @param  {String} type File type
         * @return {Object}      File data
         */
        this.getFiles = function(type) {
            return type ? data.files[type] : data.files;
        };

        /**
         * Return single file for given type(extension) and id
         * @param  {String} type File type
         * @param  {Integer} id   File ID
         * @return {Object}      File data
         */
        this.getFile = function(type, id) {
            return data.files[type][id];
        };

        /**
         * Set Editr textareas read state
         * @param  {bool} value State
         */
        this.setReadOnly = __.whenReady(function(value) {
            for (var extension in data.files) {
                for (var i = 0; i < data.files[extension].length; i++) {
                    data.files[extension][i].editor.setReadOnly(value);
                }
            }
        });

        // Extend DOM element with this Editr functions
        $.extend(editor[0], this);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Editr;
        module.exports = EditrInstances;
    }

    if (typeof ender === 'undefined') {
        this.Editr = Editr;
        this.EditrInstances = EditrInstances;
    }

    if (typeof define === "function" && define.amd) {
        define("editr", [], function() {
            return Editr;
        });
    }

}).call(this, window);
