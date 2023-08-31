export function bytesToHex(bytes) {
    if (!bytes) return '';

    let result = '';
    for (let i = 0; i < bytes.length; i++)
        result += ('0' + (bytes[i] & 0xFF).toString(16)).slice(-2);

    return result;
}

export function bytesToString(bytes) {
    if (!bytes) return '';

    bytes = new Uint8Array(bytes);
    let result = '';
    for (let i = 0; i < bytes.length; i++)
        result += String.fromCharCode(bytes[i]);

    return result;
}

Java.perform(function() {
    const Log = Java.use('android.util.Log');
    const Exception = Java.use('java.lang.Exception');
    // const SecretKeySpecDef = Java.use('javax.crypto.spec.SecretKeySpec');
    // const IvParameterSpecDef = Java.use('javax.crypto.spec.IvParameterSpec');
    const Cipher = Java.use('javax.crypto.Cipher');

    const cipherDoFinal_1 = Cipher.doFinal.overload();
    const cipherDoFinal_2 = Cipher.doFinal.overload('[B');
    const cipherDoFinal_3 = Cipher.doFinal.overload('[B', 'int');
    const cipherDoFinal_4 = Cipher.doFinal.overload('[B', 'int', 'int');
    const cipherDoFinal_5 = Cipher.doFinal.overload('[B', 'int', 'int', '[B');
    const cipherDoFinal_6 = Cipher.doFinal.overload('[B', 'int', 'int', '[B', 'int');

    const cipherUpdate_1 = Cipher.update.overload('[B');
    const cipherUpdate_2 = Cipher.update.overload('java.nio.ByteBuffer', 'java.nio.ByteBuffer');
    const cipherUpdate_3 = Cipher.update.overload('[B', 'int', 'int');
    const cipherUpdate_4 = Cipher.update.overload('[B', 'int', 'int', '[B');
    const cipherUpdate_5 = Cipher.update.overload('[B', 'int', 'int', '[B', 'int');

    // const cipherInitOverloads = [
    //     Cipher.init.overload('int', 'java.security.cert.Certificate'),
    //     Cipher.init.overload('int', 'java.security.cert.Certificate', 'java.security.SecureRandom'),
    //     Cipher.init.overload('int', 'java.security.Key'),
    //     Cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters'),
    //     Cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec'),
    //     Cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec', 'java.security.SecureRandom'),
    //     Cipher.init.overload('int', 'java.security.Key', 'java.security.AlgorithmParameters', 'java.security.SecureRandom'),
    //     Cipher.init.overload('int', 'java.security.Key', 'java.security.SecureRandom')
    // ];

    const buffers = {};
    const keys = {};

    for (const overload of Cipher.init.overloads) {
        if (overload.argumentTypes[1].className !== 'java.security.Key') continue;
        overload.implementation = function() {
            keys[this.hashCode()] = arguments[1].getEncoded();
            return overload.apply(this, arguments);
        };
    }

    for (const overload of Cipher.getInstance.overloads) {
        overload.implementation = function() {
            const instance = overload.apply(this, arguments);
            buffers[instance.hashCode()] = [];

            return instance;
        };
    }

    cipherUpdate_1.implementation = function(input) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < input.length; i++)
            buffer.push(input[i]);

        return cipherUpdate_1.call(this, input);
    };

    cipherUpdate_2.implementation = function(inputBuffer, outputBuffer) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inputBuffer.remaining(); i++)
            buffer.push(inputBuffer.get(inputBuffer.position() + i));

        return cipherUpdate_2.call(this, inputBuffer, outputBuffer);
    };

    cipherUpdate_3.implementation = function(input, inOffset, inLength) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        return cipherUpdate_3.call(this, input, inOffset, inLength);
    };

    cipherUpdate_4.implementation = function(input, inOffset, inLength, output) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        return cipherUpdate_4.call(this, input, inOffset, inLength, output);
    };

    cipherUpdate_5.implementation = function(input, inOffset, inLength, output, outOffset) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        return cipherUpdate_5.call(this, input, inOffset, inLength, output, outOffset);
    };

    cipherDoFinal_1.implementation = function() {
        const output = cipherDoFinal_1.call(this);
        printInfo(this, output);

        return output;
    };

    cipherDoFinal_2.implementation = function(input) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < input.length; i++)
            buffer.push(input[i]);

        const output = cipherDoFinal_2.call(this, input);
        printInfo(this, output);

        return output;
    };

    cipherDoFinal_3.implementation = function(output, outOffset) {
        const outLength = cipherDoFinal_3.call(this, output, outOffset);
        printInfo(this, output);

        return outLength;
    };

    cipherDoFinal_4.implementation = function(input, inOffset, inLength) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        const output = cipherDoFinal_4.call(this, input, inOffset, inLength);
        printInfo(this, output);

        return output;
    };

    cipherDoFinal_5.implementation = function(input, inOffset, inLength, output) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        const outLength = cipherDoFinal_5.call(this, input, inOffset, inLength, output);
        printInfo(this, output);

        return outLength;
    };

    cipherDoFinal_6.implementation = function(input, inOffset, inLength, output, outOffset) {
        const buffer = buffers[this.hashCode()];
        for (let i = 0; i < inLength; i++)
            buffer.push(input[inOffset + i]);

        const outLength = cipherDoFinal_6.call(this, input, inOffset, inLength, output, outOffset);
        printInfo(this, output);

        return outLength;
    };


    function printInfo(cipher, output) {
        const buffer = buffers[cipher.hashCode()];
        delete buffers[cipher.hashCode()];

        const stackTrace = Log.getStackTraceString(Exception.$new());
        if (stackTrace.includes('com.uc.'))
            console.log(
                'Key (hex):', bytesToHex(keys[cipher.hashCode()]),
                '\nInitialization Vector (hex):', bytesToHex(cipher.getIV()),
                '\nIn (text):', bytesToString(buffer),
                '\nIn (hex):', bytesToHex(buffer),
                '\nOut (hex):', bytesToHex(output),
                '\nCall stack:', stackTrace
            );

        // console.log('Performing encryption/decryption');
        // console.log('Algorithm:', cipher.getAlgorithm());
        // console.log('Initialization Vector (hex):', bytesToHex(cipher.getIV()));

        // console.log('Out (hex):', bytesToHex(encoded));
    }
});