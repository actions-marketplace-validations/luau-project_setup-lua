import { compareVersions } from "../../Util/CompareVersions";

const LATEST_LUA_RELEASE_VERSION = "5.5.0";

const CONVERT_LUA_RELEASE_VERSION: {[key: string]: string} = {
    "5.1": "5.1.5",
    "5.2": "5.2.4",
    "5.3": "5.3.6",
    "5.4": "5.4.8",
    "5.5": LATEST_LUA_RELEASE_VERSION
};

interface LuaVersionHash {
    algorithm: string;
    value: string;
}

interface LuaVersionInfo {
    version: string;
    hash: LuaVersionHash;
}

const LUA_RELEASES: {[key: string]: LuaVersionInfo} = {
    "5.5.0": { "version": "5.5.0", "hash": { "algorithm": "sha256", "value": "57ccc32bbbd005cab75bcc52444052535af691789dba2b9016d5c50640d68b3d"} },
    "5.4.8": { "version": "5.4.8", "hash": { "algorithm": "sha256", "value": "4f18ddae154e793e46eeab727c59ef1c0c0c2b744e7b94219710d76f530629ae"} },
    "5.4.7": { "version": "5.4.7", "hash": { "algorithm": "sha256", "value": "9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30"} },
    "5.4.6": { "version": "5.4.6", "hash": { "algorithm": "sha256", "value": "7d5ea1b9cb6aa0b59ca3dde1c6adcb57ef83a1ba8e5432c0ecd06bf439b3ad88"} },
    "5.4.5": { "version": "5.4.5", "hash": { "algorithm": "sha256", "value": "59df426a3d50ea535a460a452315c4c0d4e1121ba72ff0bdde58c2ef31d6f444"} },
    "5.4.4": { "version": "5.4.4", "hash": { "algorithm": "sha256", "value": "164c7849653b80ae67bec4b7473b884bf5cc8d2dca05653475ec2ed27b9ebf61"} },
    "5.4.3": { "version": "5.4.3", "hash": { "algorithm": "sha256", "value": "f8612276169e3bfcbcfb8f226195bfc6e466fe13042f1076cbde92b7ec96bbfb"} },
    "5.4.2": { "version": "5.4.2", "hash": { "algorithm": "sha256", "value": "11570d97e9d7303c0a59567ed1ac7c648340cd0db10d5fd594c09223ef2f524f"} },
    "5.4.1": { "version": "5.4.1", "hash": { "algorithm": "sha256", "value": "4ba786c3705eb9db6567af29c91a01b81f1c0ac3124fdbf6cd94bdd9e53cca7d"} },
    "5.4.0": { "version": "5.4.0", "hash": { "algorithm": "sha256", "value": "eac0836eb7219e421a96b7ee3692b93f0629e4cdb0c788432e3d10ce9ed47e28"} },
    "5.3.6": { "version": "5.3.6", "hash": { "algorithm": "sha256", "value": "fc5fd69bb8736323f026672b1b7235da613d7177e72558893a0bdcd320466d60"} },
    "5.3.5": { "version": "5.3.5", "hash": { "algorithm": "sha256", "value": "0c2eed3f960446e1a3e4b9a1ca2f3ff893b6ce41942cf54d5dd59ab4b3b058ac"} },
    "5.3.4": { "version": "5.3.4", "hash": { "algorithm": "sha256", "value": "f681aa518233bc407e23acf0f5887c884f17436f000d453b2491a9f11a52400c"} },
    "5.3.3": { "version": "5.3.3", "hash": { "algorithm": "sha256", "value": "5113c06884f7de453ce57702abaac1d618307f33f6789fa870e87a59d772aca2"} },
    "5.3.2": { "version": "5.3.2", "hash": { "algorithm": "sha256", "value": "c740c7bb23a936944e1cc63b7c3c5351a8976d7867c5252c8854f7b2af9da68f"} },
    "5.3.1": { "version": "5.3.1", "hash": { "algorithm": "sha256", "value": "072767aad6cc2e62044a66e8562f51770d941e972dc1e4068ba719cd8bffac17"} },
    "5.3.0": { "version": "5.3.0", "hash": { "algorithm": "sha256", "value": "ae4a5eb2d660515eb191bfe3e061f2b8ffe94dce73d32cfd0de090ddcc0ddb01"} },
    "5.2.4": { "version": "5.2.4", "hash": { "algorithm": "sha256", "value": "b9e2e4aad6789b3b63a056d442f7b39f0ecfca3ae0f1fc0ae4e9614401b69f4b"} },
    "5.2.3": { "version": "5.2.3", "hash": { "algorithm": "sha256", "value": "13c2fb97961381f7d06d5b5cea55b743c163800896fd5c5e2356201d3619002d"} },
    "5.2.2": { "version": "5.2.2", "hash": { "algorithm": "sha256", "value": "3fd67de3f5ed133bf312906082fa524545c6b9e1b952e8215ffbd27113f49f00"} },
    "5.2.1": { "version": "5.2.1", "hash": { "algorithm": "sha256", "value": "64304da87976133196f9e4c15250b70f444467b6ed80d7cfd7b3b982b5177be5"} },
    "5.2.0": { "version": "5.2.0", "hash": { "algorithm": "sha256", "value": "cabe379465aa8e388988073d59b69e76ba0025429d2c1da80821a252cdf6be0d"} },
    "5.1.5": { "version": "5.1.5", "hash": { "algorithm": "sha256", "value": "2640fc56a795f29d28ef15e13c34a47e223960b0240e8cb0a82d9b0738695333"} },
    "5.1.4": { "version": "5.1.4", "hash": { "algorithm": "sha256", "value": "b038e225eaf2a5b57c9bcc35cd13aa8c6c8288ef493d52970c9545074098af3a"} },
    "5.1.3": { "version": "5.1.3", "hash": { "algorithm": "sha256", "value": "6b5df2edaa5e02bf1a2d85e1442b2e329493b30b0c0780f77199d24f087d296d"} },
    "5.1.2": { "version": "5.1.2", "hash": { "algorithm": "sha256", "value": "5cf098c6fe68d3d2d9221904f1017ff0286e4a9cc166a1452a456df9b88b3d9e"} },
    "5.1.1": { "version": "5.1.1", "hash": { "algorithm": "sha256", "value": "c5daeed0a75d8e4dd2328b7c7a69888247868154acbda69110e97d4a6e17d1f0"} }
}

const LUA_WORKS: {[key: string]: LuaVersionInfo} = {
    "5.5.0-rc4": { "version": "5.5.0-rc4", "hash": { "algorithm": "sha256", "value": "57ccc32bbbd005cab75bcc52444052535af691789dba2b9016d5c50640d68b3d"} },
    "5.5.0-rc3": { "version": "5.5.0-rc3", "hash": { "algorithm": "sha256", "value": "f1a812cdcc3916f7441aec725014403177e0ef08ace097189548208f9605b2b3"} },
    "5.5.0-rc2": { "version": "5.5.0-rc2", "hash": { "algorithm": "sha256", "value": "50b24b8fce4644a4590af0f23c65945836161515b9e87c45ee1f0e62b0255a1d"} },
    "5.5.0-rc1": { "version": "5.5.0-rc1", "hash": { "algorithm": "sha256", "value": "34a4dcca0c04877fbce4baff54054b9793b70bca5d8c676ca4d3504dd47c3772"} },
    "5.5.0-beta": { "version": "5.5.0-beta", "hash": { "algorithm": "sha256", "value": "30897f95fc72565cb6c1792f721ad44e1a42e7ac587f62f7587807b3cbff1645"} },
    "5.4.8-rc1": { "version": "5.4.8-rc1", "hash": { "algorithm": "sha256", "value": "4f18ddae154e793e46eeab727c59ef1c0c0c2b744e7b94219710d76f530629ae"} },
    "5.4.7-rc4": { "version": "5.4.7-rc4", "hash": { "algorithm": "sha256", "value": "9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30"} },
    "5.4.7-rc3": { "version": "5.4.7-rc3", "hash": { "algorithm": "sha256", "value": "9bfdb269aefaa8a8c671cb509943bb2bac0704ea3fce3e6c00d92908326cd144"} },
    "5.4.7-rc2": { "version": "5.4.7-rc2", "hash": { "algorithm": "sha256", "value": "047417676188278ee86a15c2136f400f9f2a0c21ff2b0d30ab8e2c9e217853ac"} },
    "5.4.7-rc1": { "version": "5.4.7-rc1", "hash": { "algorithm": "sha256", "value": "9f51aeeaba66df34df7b63dfb8f94cb33000aad4d8788f66ac913a9efb5a64f7"} },
    "5.4.6-rc1": { "version": "5.4.6-rc1", "hash": { "algorithm": "sha256", "value": "7d5ea1b9cb6aa0b59ca3dde1c6adcb57ef83a1ba8e5432c0ecd06bf439b3ad88"} },
    "5.4.5-rc2": { "version": "5.4.5-rc2", "hash": { "algorithm": "sha256", "value": "59df426a3d50ea535a460a452315c4c0d4e1121ba72ff0bdde58c2ef31d6f444"} },
    "5.4.5-rc1": { "version": "5.4.5-rc1", "hash": { "algorithm": "sha256", "value": "6fedab336aeae90ea4eed1f0b86ac3e0367d58176153a97323c9098a6fe9daad"} },
    "5.4.4-rc3": { "version": "5.4.4-rc3", "hash": { "algorithm": "sha256", "value": "164c7849653b80ae67bec4b7473b884bf5cc8d2dca05653475ec2ed27b9ebf61"} },
    "5.4.4-rc2": { "version": "5.4.4-rc2", "hash": { "algorithm": "sha256", "value": "2c4460fa5ef62c54111323a59b510dffe8a76148da3d48cbc2b32234019ad105"} },
    "5.4.4-rc1": { "version": "5.4.4-rc1", "hash": { "algorithm": "sha256", "value": "9f93b571e287c76541b0ed4ec54a815ecb5d5bf481285ca8170ac6c8294efaa5"} },
    "5.4.3-rc2": { "version": "5.4.3-rc2", "hash": { "algorithm": "sha256", "value": "f8612276169e3bfcbcfb8f226195bfc6e466fe13042f1076cbde92b7ec96bbfb"} },
    "5.4.3-rc1": { "version": "5.4.3-rc1", "hash": { "algorithm": "sha256", "value": "989c98e30452d60adc6820f5323205e77ee22f6f88403fedb21a69d262107a92"} },
    "5.4.2-rc1": { "version": "5.4.2-rc1", "hash": { "algorithm": "sha256", "value": "11570d97e9d7303c0a59567ed1ac7c648340cd0db10d5fd594c09223ef2f524f"} },
    "5.4.1-rc1": { "version": "5.4.1-rc1", "hash": { "algorithm": "sha256", "value": "4ba786c3705eb9db6567af29c91a01b81f1c0ac3124fdbf6cd94bdd9e53cca7d"} },
    "5.3.6-rc3": { "version": "5.3.6-rc3", "hash": { "algorithm": "sha256", "value": "fc5fd69bb8736323f026672b1b7235da613d7177e72558893a0bdcd320466d60"} },
    "5.3.6-rc2": { "version": "5.3.6-rc2", "hash": { "algorithm": "sha256", "value": "e2047dc90cc654671f615c04cffbfe4a281648ab9474a82a27d68d45d6442302"} },
    "5.3.6-rc1": { "version": "5.3.6-rc1", "hash": { "algorithm": "sha256", "value": "94e86efb1141b57b270f7e75d5b76ddf12089bf570153e1d1189442cdb9487f4"} },
    "5.4.0-rc6": { "version": "5.4.0-rc6", "hash": { "algorithm": "sha256", "value": "eac0836eb7219e421a96b7ee3692b93f0629e4cdb0c788432e3d10ce9ed47e28"} },
    "5.4.0-rc5": { "version": "5.4.0-rc5", "hash": { "algorithm": "sha256", "value": "a8c31d95d1eaea2acc14472fdf917bec1fd39a333c0bf03bc2a4124f7844a4e5"} },
    "5.4.0-rc4": { "version": "5.4.0-rc4", "hash": { "algorithm": "sha256", "value": "51321a019b27e09d3f00cda2c52d185ecb0fb453c904a3e4aab1d118f9c77992"} },
    "5.4.0-rc3": { "version": "5.4.0-rc3", "hash": { "algorithm": "sha256", "value": "092087dbf519f31ff9bc74ae7560edd8ee934b6f16e37f63fc6236e1bf9a853c"} },
    "5.4.0-rc2": { "version": "5.4.0-rc2", "hash": { "algorithm": "sha256", "value": "632855309ed55e3fdd8236869b40b11ca6010e70115dd85fb2c6ab146be8677a"} },
    "5.4.0-rc1": { "version": "5.4.0-rc1", "hash": { "algorithm": "sha256", "value": "0a4fb4cb9281d924799650a768e61723fac3f0329bca39e51b90d1acc4228e71"} },
    "5.4.0-beta": { "version": "5.4.0-beta", "hash": { "algorithm": "sha256", "value": "5eb2824bc08469be9d9282c7298f001830ea013179ad0ae8a50600332568ebb9"} },
    "5.4.0-beta-rc1": { "version": "5.4.0-beta-rc1", "hash": { "algorithm": "sha256", "value": "ecd1deedca3ab604b746e42466b43e1cefbfafb1556e1ac95a92664368d5a6ec"} },
    "5.4.0-alpha-rc2": { "version": "5.4.0-alpha-rc2", "hash": { "algorithm": "sha256", "value": "d8504506ede2dbac73c5a74235feaabb2101caff59c7f87efe774b24a10e8407"} },
    "5.4.0-alpha": { "version": "5.4.0-alpha", "hash": { "algorithm": "sha256", "value": "d8504506ede2dbac73c5a74235feaabb2101caff59c7f87efe774b24a10e8407"} },
    "5.4.0-alpha-rc1": { "version": "5.4.0-alpha-rc1", "hash": { "algorithm": "sha256", "value": "6dce98f6a5b19eef9e5090db09a82e1653425fd9886671c3041ab356491f2ef8"} },
    "5.3.5-rc2": { "version": "5.3.5-rc2", "hash": { "algorithm": "sha256", "value": "0c2eed3f960446e1a3e4b9a1ca2f3ff893b6ce41942cf54d5dd59ab4b3b058ac"} },
    "5.3.5-rc1": { "version": "5.3.5-rc1", "hash": { "algorithm": "sha256", "value": "23372e52138419459460ce576449b901086222e2c1f68812a89400391eb575f2"} },
    "5.4.0-work2": { "version": "5.4.0-work2", "hash": { "algorithm": "sha256", "value": "68b7e8f1ff561b9a7e1c29de26ff99ac2a704773c0965a4fe1800b7657d5a057"} },
    "5.4.0-work1": { "version": "5.4.0-work1", "hash": { "algorithm": "sha256", "value": "ada03980481110bfde44b3bd44bde4b03d72c84318b34d657b5b5a91ddb3912c"} },
    "5.3.4-rc3": { "version": "5.3.4-rc3", "hash": { "algorithm": "sha256", "value": "f681aa518233bc407e23acf0f5887c884f17436f000d453b2491a9f11a52400c"} },
    "5.3.4-rc2": { "version": "5.3.4-rc2", "hash": { "algorithm": "sha256", "value": "9c034489170cb0b4d0899f6cb833630ed4deeaea04f5ccb384d4c9125a43b2e9"} },
    "5.3.4-rc1": { "version": "5.3.4-rc1", "hash": { "algorithm": "sha256", "value": "84818084e005e874b701f4aa6791659f5b39f23ac4a5eaa7b9a99d0734c6564d"} },
    "5.3.3-rc3": { "version": "5.3.3-rc3", "hash": { "algorithm": "sha256", "value": "5113c06884f7de453ce57702abaac1d618307f33f6789fa870e87a59d772aca2"} },
    "5.3.3-rc2": { "version": "5.3.3-rc2", "hash": { "algorithm": "sha256", "value": "0701c6e9063adce208c22313f5a516d5ed46a1b227581b3e905117504a7ecf2d"} },
    "5.3.3-rc1": { "version": "5.3.3-rc1", "hash": { "algorithm": "sha256", "value": "247a09870ee5a8027f3848fd06fb9ce98821a6f2b443fdb863daf1bf38d23334"} },
    "5.3.2-rc2": { "version": "5.3.2-rc2", "hash": { "algorithm": "sha256", "value": "c740c7bb23a936944e1cc63b7c3c5351a8976d7867c5252c8854f7b2af9da68f"} },
    "5.3.2-rc1": { "version": "5.3.2-rc1", "hash": { "algorithm": "sha256", "value": "edcd5dc637824e71a98392be9ebc67e806fc93d84b89877086428a6b0be08c42"} },
    "5.3.1-rc2": { "version": "5.3.1-rc2", "hash": { "algorithm": "sha256", "value": "072767aad6cc2e62044a66e8562f51770d941e972dc1e4068ba719cd8bffac17"} },
    "5.3.1-rc1": { "version": "5.3.1-rc1", "hash": { "algorithm": "sha256", "value": "57cb83791cae679f5b04abfe43f9c85d2ad8e8ae47864484b511fd455adae50d"} },
    "5.2.4-rc1": { "version": "5.2.4-rc1", "hash": { "algorithm": "sha256", "value": "b9e2e4aad6789b3b63a056d442f7b39f0ecfca3ae0f1fc0ae4e9614401b69f4b"} },
    "5.3.0-rc4": { "version": "5.3.0-rc4", "hash": { "algorithm": "sha256", "value": "ae4a5eb2d660515eb191bfe3e061f2b8ffe94dce73d32cfd0de090ddcc0ddb01"} },
    "5.3.0-rc3": { "version": "5.3.0-rc3", "hash": { "algorithm": "sha256", "value": "f03d91872689d818888ab6cde4c15f5fd319a7fa483ccdb2797796a86063a0a5"} },
    "5.3.0-rc2": { "version": "5.3.0-rc2", "hash": { "algorithm": "sha256", "value": "a6a30ea6548089821e4ddd7586624f9ef0da0186312951c00d7e300c1ca8e314"} },
    "5.3.0-rc1": { "version": "5.3.0-rc1", "hash": { "algorithm": "sha256", "value": "25c2123c9bd58e658145bad31732a0b12f218d6e56e0fd9b53ed32d3cf181062"} },
    "5.3.0-rc0": { "version": "5.3.0-rc0", "hash": { "algorithm": "sha256", "value": "1c5788211d4b1a7147e1f7bcc4dae752910cd1a62af1c74e6686a1f2ce13b144"} },
    "5.3.0-beta": { "version": "5.3.0-beta", "hash": { "algorithm": "sha256", "value": "a1137c07e58bcc3e9b270a6b8dc42623ae8addba1a5c0da2239e7e65645bce90"} },
    "5.3.0-alpha": { "version": "5.3.0-alpha", "hash": { "algorithm": "sha256", "value": "23ef23ef74da2cc057b68078e2085f6c12a2f8160229449d4cf2c30b22537846"} },
    "5.3.0-work3": { "version": "5.3.0-work3", "hash": { "algorithm": "sha256", "value": "c42d633c237e9a3a237496559fbb28627fc72c3298480ac05b4210b1dee0f32c"} },
    "5.3.0-work2": { "version": "5.3.0-work2", "hash": { "algorithm": "sha256", "value": "a33d42f327e875b85b4d6d84cb62161a246af860fef1ce29d8d2fea825876423"} },
    "5.2.3-rc1": { "version": "5.2.3-rc1", "hash": { "algorithm": "sha256", "value": "13c2fb97961381f7d06d5b5cea55b743c163800896fd5c5e2356201d3619002d"} },
    "5.3.0-work1": { "version": "5.3.0-work1", "hash": { "algorithm": "sha256", "value": "d1435aded81c313592c4cbbc6cc1ffa63706fdb19c6c353aed1fec142cd73cfd"} },
    "5.2.2-rc4": { "version": "5.2.2-rc4", "hash": { "algorithm": "sha256", "value": "3fd67de3f5ed133bf312906082fa524545c6b9e1b952e8215ffbd27113f49f00"} },
    "5.2.2-rc3": { "version": "5.2.2-rc3", "hash": { "algorithm": "sha256", "value": "8ca83f7daa52750d2b49a032619b2e992d8867c4f2232f7c6a740fd3e40bfd32"} },
    "5.2.2-rc2": { "version": "5.2.2-rc2", "hash": { "algorithm": "sha256", "value": "433b1245b1689e59ca531ba66de2834c2d63a932d71b5decca307708645da8c6"} },
    "5.2.2-rc1": { "version": "5.2.2-rc1", "hash": { "algorithm": "sha256", "value": "433e7ca1a7590a8ad132b7583748c8d3e329929cc97163cf2d4be79e53b66c16"} },
    "5.2.1-rc4": { "version": "5.2.1-rc4", "hash": { "algorithm": "sha256", "value": "64304da87976133196f9e4c15250b70f444467b6ed80d7cfd7b3b982b5177be5"} },
    "5.2.1-rc3": { "version": "5.2.1-rc3", "hash": { "algorithm": "sha256", "value": "849733c3e125395e8c94debb5130555e979be76fd2767f6fcf3b03a3d9a22b3d"} },
    "5.2.1-rc2": { "version": "5.2.1-rc2", "hash": { "algorithm": "sha256", "value": "938c2da29e04651b0cb614b41417dcbd6679e7c400ce79f57938100430e7bc9a"} },
    "5.2.1-rc1": { "version": "5.2.1-rc1", "hash": { "algorithm": "sha256", "value": "7a895c3341683075436e86fe3a44325ab8cd3f29731cf057d41155f5ec9ec72d"} },
    "5.2.1-work1": { "version": "5.2.1-work1", "hash": { "algorithm": "sha256", "value": "acdfef8c61524e3c1c047418a6beaab33da166fa83fb4a2f07d5519ef6fa5922"} },
    "5.1.5-rc2": { "version": "5.1.5-rc2", "hash": { "algorithm": "sha256", "value": "2640fc56a795f29d28ef15e13c34a47e223960b0240e8cb0a82d9b0738695333"} },
    "5.1.5-rc1": { "version": "5.1.5-rc1", "hash": { "algorithm": "sha256", "value": "8a619dfd05c80a687f8fe9c01e66200577aa4f3962b2a4c71525fad78efb5ba5"} },
    "5.2.0-rc8": { "version": "5.2.0-rc8", "hash": { "algorithm": "sha256", "value": "cabe379465aa8e388988073d59b69e76ba0025429d2c1da80821a252cdf6be0d"} },
    "5.2.0-rc7": { "version": "5.2.0-rc7", "hash": { "algorithm": "sha256", "value": "c5ece090e005b9fbceb4b7dca0a191dac248590059ba3119ba6ac451883db5b3"} },
    "5.2.0-rc6": { "version": "5.2.0-rc6", "hash": { "algorithm": "sha256", "value": "ad80dca436d983caeec6bac6cd22aeafc2cfda9ded22b902dd042b77b164d968"} },
    "5.2.0-rc5": { "version": "5.2.0-rc5", "hash": { "algorithm": "sha256", "value": "4e4bfeeba3c7207fec825dd7971c76fe5825ec7663ea71ead11648f454325f72"} },
    "5.2.0-rc4": { "version": "5.2.0-rc4", "hash": { "algorithm": "sha256", "value": "d0c8dcd5ce94d59ead8866a2d2481145789c8aab592ed99e1bb0890c898ee356"} },
    "5.2.0-rc3": { "version": "5.2.0-rc3", "hash": { "algorithm": "sha256", "value": "fb2db80b5448601c8c6ccbd651d471be07d94465cd0c24f999d0e1a55ee2a31d"} },
    "5.2.0-rc2": { "version": "5.2.0-rc2", "hash": { "algorithm": "sha256", "value": "fcf77ed357b154295471fc16ff64362a1170825441aeae62dcc185bc5eb87d28"} },
    "5.2.0-rc1": { "version": "5.2.0-rc1", "hash": { "algorithm": "sha256", "value": "8f3835d6167101eff95a7f34df513337269f1a9934a5593e79e546427423e4b5"} },
    "5.2.0-beta-rc7": { "version": "5.2.0-beta-rc7", "hash": { "algorithm": "sha256", "value": "e7e49a1cc1d03ca24caed0cd8d7b76b6fb88a96bf8814f609ddc821d9813cdc6"} },
    "5.2.0-beta": { "version": "5.2.0-beta", "hash": { "algorithm": "sha256", "value": "e7e49a1cc1d03ca24caed0cd8d7b76b6fb88a96bf8814f609ddc821d9813cdc6"} },
    "5.2.0-beta-rc6": { "version": "5.2.0-beta-rc6", "hash": { "algorithm": "sha256", "value": "30f0948723fd306ad344bf52e9e393a2a64b26900abad37aacafa45a547915ea"} },
    "5.2.0-beta-rc5": { "version": "5.2.0-beta-rc5", "hash": { "algorithm": "sha256", "value": "9c1e5e240e36535d21d3dc53dd2b3f62b1fef737fdb4e9183ed0b71a77163963"} },
    "5.2.0-beta-rc4": { "version": "5.2.0-beta-rc4", "hash": { "algorithm": "sha256", "value": "2983f5e2bccbb7ea23512d79e697d253f06509e9077a6663956f3ae71b33c658"} },
    "5.2.0-beta-rc3": { "version": "5.2.0-beta-rc3", "hash": { "algorithm": "sha256", "value": "51edfebdc1f4a31c41c1a320ccf09ab35fa3f2921025ab1ad0a6b50140a05ed0"} },
    "5.2.0-beta-rc2": { "version": "5.2.0-beta-rc2", "hash": { "algorithm": "sha256", "value": "a334806a8e785f19bfd6acc15e636a8d1d2184e9ccd31a96cfab6f22cf6e746d"} },
    "5.2.0-beta-rc1": { "version": "5.2.0-beta-rc1", "hash": { "algorithm": "sha256", "value": "9370b606cfbf2e730ebc9669837bc1643ece222fd214bfbcc0a81075f5f556ee"} },
    "5.2.0-alpha-rc4": { "version": "5.2.0-alpha-rc4", "hash": { "algorithm": "sha256", "value": "8d08193f8819db49827c1687e1cf73be45268478b0aa2c99b791576d68646aa0"} },
    "5.2.0-alpha": { "version": "5.2.0-alpha", "hash": { "algorithm": "sha256", "value": "8d08193f8819db49827c1687e1cf73be45268478b0aa2c99b791576d68646aa0"} },
    "5.2.0-alpha-rc3": { "version": "5.2.0-alpha-rc3", "hash": { "algorithm": "sha256", "value": "e1b466477945367f0fbb16ba0271f8a1609206f6352e909eddb9f5adbbc852c7"} },
    "5.2.0-alpha-rc2": { "version": "5.2.0-alpha-rc2", "hash": { "algorithm": "sha256", "value": "9562008561caa63422a1369df03271b4a205de826aa0cf03b6a354b34854d344"} },
    "5.2.0-alpha-rc1": { "version": "5.2.0-alpha-rc1", "hash": { "algorithm": "sha256", "value": "37ca7c4cb232c0954268446a234240e678de0f3691aeda2848dbd12bd4024a91"} },
    "5.2.0-work5": { "version": "5.2.0-work5", "hash": { "algorithm": "sha256", "value": "fc6a2c730dc8fadf156fc3632a6a02713c4926f157ef34fa2f6bb4082f4e4a9b"} },
    "5.2.0-work4": { "version": "5.2.0-work4", "hash": { "algorithm": "sha256", "value": "8b2539bc6d417dc85e76c956f7630e3629c8412605db047f38bbfe7b29030b0c"} },
    "5.2.0-work3": { "version": "5.2.0-work3", "hash": { "algorithm": "sha256", "value": "c5c5e06b36fd0097ff8b65489a24391631009c816417798108f7103772977b4b"} },
    "5.2.0-work2": { "version": "5.2.0-work2", "hash": { "algorithm": "sha256", "value": "5344b821acfe3d623b12a2c4c454837fd3b15e9c5a96a65781663053fd05cd0a"} },
    "5.2.0-work1": { "version": "5.2.0-work1", "hash": { "algorithm": "sha256", "value": "c1af40891fa432af6bca1ed0d163c4f24f7997c4babbffa451f24f95bd54927a"} },
    "5.1.4-rc3": { "version": "5.1.4-rc3", "hash": { "algorithm": "sha256", "value": "b038e225eaf2a5b57c9bcc35cd13aa8c6c8288ef493d52970c9545074098af3a"} },
    "5.1.4-rc2": { "version": "5.1.4-rc2", "hash": { "algorithm": "sha256", "value": "64a8f099248064ebbd418e0efdc4de6aa10982ad3a4011acc9a58c8f37a4fce5"} },
    "5.1.4-rc1": { "version": "5.1.4-rc1", "hash": { "algorithm": "sha256", "value": "8b903c7f64c2595cd7fad7a63c828dd184c29ef426ad4c3e850f8a2594549778"} },
    "5.1.3-rc5": { "version": "5.1.3-rc5", "hash": { "algorithm": "sha256", "value": "6b5df2edaa5e02bf1a2d85e1442b2e329493b30b0c0780f77199d24f087d296d"} },
    "5.1.3-rc4": { "version": "5.1.3-rc4", "hash": { "algorithm": "sha256", "value": "65a157f49993ad93016b2f7301543024d6939e29da5e9d081a3c8c93d0796224"} },
    "5.1.3-rc3": { "version": "5.1.3-rc3", "hash": { "algorithm": "sha256", "value": "d26f27272d4064df9756ae3ba308edd00432f1558d99b757378ffc3f0b5da49f"} },
    "5.1.3-rc2": { "version": "5.1.3-rc2", "hash": { "algorithm": "sha256", "value": "5da201797c131bca05072028f45d7168d1aceb3ea45d0195aa23874aa78059aa"} },
    "5.1.3-rc1": { "version": "5.1.3-rc1", "hash": { "algorithm": "sha256", "value": "232219e6d26722047c52310fead85849b15480194fc47693c676670cd61bcc55"} },
    "5.1.2-rc5": { "version": "5.1.2-rc5", "hash": { "algorithm": "sha256", "value": "5cf098c6fe68d3d2d9221904f1017ff0286e4a9cc166a1452a456df9b88b3d9e"} },
    "5.1.2-rc4": { "version": "5.1.2-rc4", "hash": { "algorithm": "sha256", "value": "153911c46eb71e78c08eee39c8469e8e117a6fdf3ec656d4412c7c33841a0fd1"} },
    "5.1.2-rc3": { "version": "5.1.2-rc3", "hash": { "algorithm": "sha256", "value": "ca5730f14e5daab90d7dbd457ebd556d38206f7d0c1b5d238b740355ac91dbde"} },
    "5.1.2-rc2": { "version": "5.1.2-rc2", "hash": { "algorithm": "sha256", "value": "3f31cdfbc983c1aad7b439f2122cb15d168bce028b97992b66f9e4b1056a8d16"} },
    "5.1.2-rc1": { "version": "5.1.2-rc1", "hash": { "algorithm": "sha256", "value": "27c4b24d4536689ddfe3f5fbc0e5db8f922cfcfb6b3e9a30dbfb9d40f8f4658d"} },
    "5.1.1-rc4": { "version": "5.1.1-rc4", "hash": { "algorithm": "sha256", "value": "f9baa3c37915be2e7cb8fa205b042bd403fa0fe854fb92ede1861d9bc999ded9"} },
    "5.1.1-rc3": { "version": "5.1.1-rc3", "hash": { "algorithm": "sha256", "value": "b5eb2b1382716d5755a57e2a19fd919748a8a191fc1a69030f9225b85e6fff6c"} },
    "5.1.1-rc2": { "version": "5.1.1-rc2", "hash": { "algorithm": "sha256", "value": "b14642c7f5f211f8f899ae4e97891d025a72245a3c6938b4d37024513730d71e"} },
    "5.1.1-rc1": { "version": "5.1.1-rc1", "hash": { "algorithm": "sha256", "value": "84dda3f7a03999785488304e9561e4f6771366845d3488efbb8e077b20839c99"} }
}

export interface IPucLuaVersion {
    getMajor(): number;
    getMinor(): number;
    getBuild(): number;
    getHashAlgorithm(): string;
    getHashValue(): string;
    getString(): string;
    getDownloadUrl(): string;
    compareTo(other: IPucLuaVersion): number;
}

export function parsePucLuaVersion(version: string): Promise<IPucLuaVersion> {
    return new Promise<IPucLuaVersion>((resolve, reject) => {
        const pucLuaVersion = version in CONVERT_LUA_RELEASE_VERSION ?
            (<string>(CONVERT_LUA_RELEASE_VERSION[version])) :
            ((version || LATEST_LUA_RELEASE_VERSION).trim());
        if (pucLuaVersion in LUA_RELEASES) {
            const releaseMatch = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(pucLuaVersion);
            if (releaseMatch) {
                const major = Number(releaseMatch[1]);
                if (major >= 5) {
                    const minor = Number(releaseMatch[2]);
                    if (major == 5 && minor == 0) {
                        reject(new Error("The minimum supported Lua version is 5.1"));
                    }
                    else {
                        const build = Number(releaseMatch[3]);
                        const v = LUA_RELEASES[pucLuaVersion];
                        resolve(
                            new PucLuaReleaseVersion(
                                major, minor, build,
                                v.hash.algorithm, v.hash.value
                            )
                        );
                    }
                }
                else {
                    reject(new Error("Unsupported major version of Lua"));
                }
            }
            else {
                reject(new Error("Internal error: Unknown format for a Lua release version"));
            }
        }
        else if (pucLuaVersion in LUA_WORKS) {
            const workMatch = /^([0-9]+)\.([0-9]+)\.([0-9]+)\-([0-9a-zA-Z\-\.]+)$/.exec(pucLuaVersion);
            if (workMatch) {
                const major = Number(workMatch[1]);
                if (major >= 5) {
                    const minor = Number(workMatch[2]);
                    if (major == 5 && minor == 0) {
                        reject(new Error("The minimum supported Lua version is 5.1"));
                    }
                    else {
                        const build = Number(workMatch[3]);
                        const suffix = workMatch[4];
                        const v = LUA_WORKS[pucLuaVersion];
                        resolve(
                            new PucLuaWorkVersion(
                                major, minor, build,
                                v.hash.algorithm, v.hash.value,
                                suffix,
                                false
                            )
                        );
                    }
                }
                else {
                    reject(new Error("Unsupported major version of Lua"));
                }
            }
            else {
                reject(new Error("Internal error: Unknown format for a Lua work version"));
            }
        }
        else {
            reject(new Error("Unsupported version of Lua"));
        }
    });
}

export abstract class AbstractPucLuaVersion implements IPucLuaVersion {
    private major: number;
    private minor: number;
    private build: number;
    private hashAlgorithm: string;
    private hashValue: string;

    getMajor(): number {
        return this.major;
    }

    getMinor(): number {
        return this.minor;
    }

    getBuild(): number {
        return this.build;
    }

    getHashAlgorithm(): string {
        return this.hashAlgorithm;
    }

    getHashValue(): string {
        return this.hashValue;
    }

    abstract getDownloadUrl(): string;
    abstract getString(): string;

    compareTo(other: IPucLuaVersion): number {
        return compareVersions(
            [this.major, this.minor, this.build],
            [other.getMajor(), other.getMinor(), other.getBuild()]
        );
    }

    constructor(major: number, minor: number, build: number, hashAlgorithm: string, hashValue: string) {
        this.major = major;
        this.minor = minor;
        this.build = build;
        this.hashAlgorithm = hashAlgorithm;
        this.hashValue = hashValue;
    }
}

export class PucLuaReleaseVersion extends AbstractPucLuaVersion {
    getString(): string {
        const M = this.getMajor();
        const m = this.getMinor();
        const b = this.getBuild();
        return `${M}.${m}.${b}`;
    }
    getDownloadUrl(): string {
        return `https://lua.org/ftp/lua-${this.getString()}.tar.gz`;
    }
    constructor(major: number, minor: number, build: number, hashAlgorithm: string, hashValue: string) {
        super(major, minor, build, hashAlgorithm, hashValue);
    }
}

export class PucLuaWorkVersion extends AbstractPucLuaVersion {
    private suffix: string;
    private current: boolean;

    getSuffix(): string {
        return this.suffix;
    }
    getCurrent(): boolean {
        return this.current;
    }
    getString(): string {
        const M = this.getMajor();
        const m = this.getMinor();
        const b = this.getBuild();
        return `${M}.${m}.${b}-${this.suffix}`;
    }
    getDownloadUrl(): string {
        return this.current ?
            `https://lua.org/work/lua-${this.getString()}.tar.gz` :
            `https://lua.org/work/old/lua-${this.getString()}.tar.gz`;
    }
    constructor(major: number, minor: number, build: number, hashAlgorithm: string, hashValue: string, suffix: string, current: boolean) {
        super(major, minor, build, hashAlgorithm, hashValue);
        this.suffix = suffix;
        this.current = current;
    }
}

const LUA_5_1_1_VERSION = LUA_RELEASES["5.1.1"];
const LUA_5_2_0_VERSION = LUA_RELEASES["5.2.0"];
const LUA_5_3_0_VERSION = LUA_RELEASES["5.3.0"];
const LUA_5_4_0_VERSION = LUA_RELEASES["5.4.0"];
const LUA_5_5_0_VERSION = LUA_RELEASES["5.5.0"];

export const LUA_51_VERSION: IPucLuaVersion = new PucLuaReleaseVersion(5, 1, 1, LUA_5_1_1_VERSION.hash.algorithm, LUA_5_1_1_VERSION.hash.value);
export const LUA_52_VERSION: IPucLuaVersion = new PucLuaReleaseVersion(5, 2, 0, LUA_5_2_0_VERSION.hash.algorithm, LUA_5_2_0_VERSION.hash.value);
export const LUA_53_VERSION: IPucLuaVersion = new PucLuaReleaseVersion(5, 3, 0, LUA_5_3_0_VERSION.hash.algorithm, LUA_5_3_0_VERSION.hash.value);
export const LUA_54_VERSION: IPucLuaVersion = new PucLuaReleaseVersion(5, 4, 0, LUA_5_4_0_VERSION.hash.algorithm, LUA_5_4_0_VERSION.hash.value);
export const LUA_55_VERSION: IPucLuaVersion = new PucLuaReleaseVersion(5, 5, 0, LUA_5_5_0_VERSION.hash.algorithm, LUA_5_5_0_VERSION.hash.value);