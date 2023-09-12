import morgan from 'morgan';
import clc from 'cli-color';

morgan.format('myformat', (tokens, req, res) => {
    const date = tokens.date(req, res, 'web');

    let koreanDate = '';
    if (date) {
        const dateObject = new Date(date);
        koreanDate = new Intl.DateTimeFormat('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(dateObject);
    }

    return [
        clc.xterm(33)(`[${koreanDate}]`),
        clc.xterm(214)(`"${tokens.method(req, res)} ${tokens.url(req, res)}"`),
        clc.white(`${tokens.status(req, res)}`),
        clc.xterm(40)(`${tokens.res(req, res, 'content-length')}`),
        '-',
        clc.xterm(45)(`${tokens['response-time'](req, res)} ms`),
    ].join(' ');
});

export const morganMiddleware = morgan('myformat');
