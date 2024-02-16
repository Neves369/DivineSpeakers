declare type CheckVersionResponse = {
    local: string;
    remote: string;
    result: 'new' | 'old' | 'equal';
    detail: 'remote > local' | 'remote < local' | 'remote === local';
};
export declare const compareVersion: (local: string, remote: string) => CheckVersionResponse['result'];
declare const checkVersion: () => Promise<CheckVersionResponse>;
export default checkVersion;
