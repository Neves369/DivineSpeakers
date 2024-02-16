import { Platform } from 'react-native';
import compareVersions from 'compare-versions';
import { getIOSVersion } from './ios';
import { getAndroidVersion } from './android';
import app from "../../app.json";


export const compareVersion = (local, remote) => {
    switch (compareVersions(local, remote)) {
        case -1:
            return 'new';
        case 1:
            return 'old';
        default:
            return 'equal';
    }
};

const checkVersion = async () => {
    
    let version;
    let remoteVersion;

    version = (Platform.OS === 'ios')? app.expo.ios.buildNumber : app.expo.version

    try {
        remoteVersion = (Platform.OS === 'ios')? 
            await getIOSVersion()
        : 
            await getAndroidVersion();
    }
    catch (e) {
        throw new Error(e.message);
    }
    const result = compareVersion(version, remoteVersion);

    let detail;
    switch (result) {
        case 'new':
            detail = 'remote > local';
            break;
        case 'old':
            detail = 'remote < local';
            break;
        default:
            detail = 'remote === local';
            break;
    }
    return {
        local: version,
        remote: remoteVersion,
        result,
        detail,
    };
};

export default checkVersion;
