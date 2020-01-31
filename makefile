#SHELL := /bin/bash
BUILD_DIR=build

VER_BRANCH=build-release
VER_FILE=VERSION

LITERATE_TOOLS="https://github.com/vlead/literate-tools.git"
LITERATE_DIR=literate-tools
ELISP_DIR=elisp
ORG_DIR=org-templates
STYLE_DIR=style
BUILD_DIR=build
CODE_DIR=build/code
DOC_DIR=build/docs
SRC_DIR=src
DIAGRAMS_DIR=src/diagrams
PWD=$(shell pwd)
LINT_FILE=${PWD}/${CODE_DIR}/lint_output
EXIT_FILE=${PWD}/exit.txt
STATUS=0

all:  build-with-lint

clean:	
	make -f tangle-make clean
	rm -rf ${BUILD_DIR}

init:
	./init.sh

build: init
	make -f tangle-make -k all
	rsync -a ${SRC_DIR}/runtime/static ${CODE_DIR}/runtime/
	rsync -a ${SRC_DIR}/runtime/templates ${CODE_DIR}/runtime/

# get the latest commit hash and its subject line
# and write that to the VERSION file
write-version:
	echo -n "Built from commit: " > ${CODE_DIR}/${VER_FILE}
	echo `git rev-parse HEAD` >> ${CODE_DIR}/${VER_FILE}
	echo `git log --pretty=format:'%s' -n 1` >> ${CODE_DIR}/${VER_FILE}

lint:
	(pep8 --ignore=E302 ${PWD}/${CODE_DIR} > ${LINT_FILE}; ([ $$? -eq 0 ] && echo "no lint errors!") || echo "lint errors exist!")

build-with-lint: build lint
