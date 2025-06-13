type GetNodeArgv = (name: string) => string | undefined;

const getNodeArgv: GetNodeArgv = (name) => {
  const args = process.argv.slice(2);

  // Check for --key=value format first
  const equalArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalArg) {
    return equalArg.split("=")[1];
  }

  // Check for --key value format
  const index = args.indexOf(name);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }

  return undefined;
};

export { getNodeArgv };
