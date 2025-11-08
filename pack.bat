@ECHO OFF
@GOTO :MAIN %*

:USAGE
@ECHO usage:
@ECHO     "%COMSPEC%" /C pack.bat
@ECHO         to generate a tar.gz
@ECHO
@GOTO :SUCCESS

:COMPRESS
@SETLOCAL
@SET _QUOTED_TARGET_DIR=%1
@SET _QUOTED_TARGET_DIRNAME=%2
@SET _QUOTED_CURRENT_DIR=%3
@SET _TARGET_CURRENT_DIR=%_QUOTED_CURRENT_DIR:~1,-1%
@SET _TARGET_DIRNAME=%_QUOTED_TARGET_DIRNAME:~1,-1%
@SET _TARGET_DIR=%_QUOTED_TARGET_DIR:~1,-1%
@IF "%_TARGET_DIRNAME%" EQU "setup-lua" (
    @IF EXIST %_QUOTED_CURRENT_DIR% (
        @IF EXIST %_QUOTED_TARGET_DIR% (
            @IF EXIST "%_TARGET_DIR%%_TARGET_DIRNAME%" (
                @FOR /F "USEBACKQ TOKENS=*" %%G IN (`where TAR`) DO (
                    @IF %ERRORLEVEL% EQU 0 (
                        @PUSHD %_QUOTED_TARGET_DIR%
                        @TAR -czvf "%_TARGET_CURRENT_DIR%\setup-lua.tar.gz" "--exclude=.git" "--exclude=.vscode" "--exclude=src\CacheService.ts" "--exclude=src\GitHubCore.ts" "--exclude=package-lock.json" "--exclude=node_modules" %_QUOTED_TARGET_DIRNAME%
                        @IF %ERRORLEVEL% EQU 0 (
                            @POPD %_QUOTED_TARGET_DIR%
                            @GOTO :SUCCESS
                        ) ELSE (
                            @POPD %_QUOTED_TARGET_DIR%
                            @GOTO :FAIL
                        )
                    ) ELSE (
                        @ECHO Unable to find tar. Please, install tar to pack the source code.
                        @GOTO :FAIL
                    )
                )
            ) ELSE (
                @ECHO Subdirectory %_QUOTED_TARGET_DIRNAME% not found at directory %_QUOTED_TARGET_DIR%
                @GOTO :FAIL
            )
        ) ELSE (
            @ECHO Directory %_QUOTED_TARGET_DIR% not found
            @GOTO :FAIL
        )
    ) ELSE (
        @ECHO Current directory %_QUOTED_CURRENT_DIR% not found
        @GOTO :FAIL
    )
) ELSE (
    @ECHO Invalid directory name to pack. Please, rename the pack directory to `setup-lua'
    @GOTO :FAIL
)
@ENDLOCAL

:MAIN
@IF "%1" EQU "--help" (
    @GOTO :USAGE
) ELSE (
    @FOR %%A IN ("%~dp0.") DO @CALL :COMPRESS "%%~dpA" "%%~nA" "%CD%"
)

:SUCCESS
@EXIT /B 0

:FAIL
@EXIT /B 1
