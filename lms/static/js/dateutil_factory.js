
/**
 *
 * A helper function to utilize DateUtils quickly in display templates.
 *
 * @param: {string} data-datetime A pre-localized datetime string, assumed to be in UTC.
 * @param: {string} lang The user's preferred language.
 * @param: {string} data-timezone (optional) A user-set timezone preference.
 * @param: {object} data-format (optional) a format constant as defined in DataUtil.dateFormatEnum.
 * @param: {string} data-string (optional) a string for parsing through StringUtils after localizing
 * datetime
 *
 * @return: {string} a user-time, localized, formatted datetime string
 *
 */

(function(define) {
    'use strict';

    define([
        'jquery',
        'edx-ui-toolkit/js/utils/date-utils',
        'edx-ui-toolkit/js/utils/string-utils'
    ], function($, DateUtils, StringUtils) {
        var DateUtilFactory;
        var localizedTime;
        var stringHandler;
        var displayDatetime;
        var isValid;
        var transform;

        transform = function(iterationKey) {
            var context;
            $(iterationKey).each(function() {
                if (isValid($(this).data('datetime'))) {
                    //oleg2106 hack
                    //available formats in utils/date-utils.js 
                    //shortDate, longDate, time, defaultFormat, defaultWithParen, longDateTime
                    let df_lang = $(this).data('language');
                    if (!df_lang || df_lang == 'None'){
                        df_lang = 'ru';
                    }
                    let df_format;
                    let _df_format = $(this).data('format');
                    if (!_df_format || _df_format == 'None'){
                        df_format = 'DD.MM.YYYY, HH[:]mm (z)'; // day Month year, time МСК
                    }else{
                        df_format = DateUtils.dateFormatEnum[_df_format]
                    }
                    
                    context = {
                        datetime: $(this).data('datetime'),
                        timezone: $(this).data('timezone'),
                        language: df_lang,
                        format: df_format
                    };                    

                    displayDatetime = stringHandler(
                        localizedTime(context),
                        $(this).data('string'),
                        $(this).data('datetoken')
                    );
                    $(this).text(displayDatetime);
                } else {
                    displayDatetime = stringHandler(
                        $(this).data('string')
                    );
                    $(this).text(displayDatetime);
                }
            });
        };

        localizedTime = function(context) {
            return DateUtils.localize(context);
        };

        stringHandler = function(localTimeString, containerString, token) {
            var returnString;
            var interpolateDict = {};
            var dateToken;
            if (isValid(token)) {
                dateToken = token;
            } else {
                dateToken = 'date';
            }
            interpolateDict[dateToken] = localTimeString;

            if (isValid(containerString)) {
                returnString = StringUtils.interpolate(
                    containerString,
                    interpolateDict
                );
            } else {
                returnString = localTimeString;
            }
            return returnString;
        };

        isValid = function(candidateVariable) {
            return candidateVariable !== undefined
                && candidateVariable !== ''
                && candidateVariable !== 'Invalid date'
                && candidateVariable !== 'None';
        };
        DateUtilFactory = {
            transform: transform,
            stringHandler: stringHandler
        };
        return DateUtilFactory;
    });
}).call(this, define || RequireJS.define);
