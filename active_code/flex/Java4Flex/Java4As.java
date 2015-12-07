public class Create4Flex {   
  
    // java的代码目录   
    private static String JAVA_SRC_PATH = "D:/workspace/test/src/";   
  
    // flex代码目录   
    private static String FLEX_SRC_PATH = "D:/workspace/test/src/";   
  
    // POJO的包路径   
    private static String JAVA_PACKAGE = "com.test.entity";   
  
    // 将要生成的as的value object包路径   
    private static String FLEX_PACKAGE = "flex.actionScript";   
  
  // 需要过滤掉以此后缀结尾的实体（因为我们用的是ibatis持久层，abator生成的实体包括两个，一个是实体本身，一个是用于拼sql的Example类，需要去掉以Example结尾的类）   
    private static String EXAMPLE = "Example";   
  
    /**  
     * @param args  
     */  
    public static void main(String[] args) {   
        String srcPath = JAVA_PACKAGE.replaceAll("\\.", "/");   
  
        File dir = new File(JAVA_SRC_PATH + srcPath);   
        File[] files = dir.listFiles();   
  
        String name = "";   
        for (File file : files) {   
            if (!file.isDirectory() && file.isFile()){   
                name = file.getName();   
  
                if (name.lastIndexOf(EXAMPLE + ".java") == -1){   
  
                    name = name.replaceAll(".java", "");   
                    try {   
                        Class clazz = Class.forName(JAVA_PACKAGE + "." + name);   
                        createFile(clazz);   
                    } catch (Exception e) {   
                        // TODO Auto-generated catch block   
                        e.printStackTrace();   
                    }   
                }   
            }   
        }   
    }   
  
    private static void createFile(Class clz) throws IOException{   
        String flexSrcPath = FLEX_PACKAGE.replaceAll("\\.", "/");   
  
        String fileName = clz.getSimpleName();   
        File dir = new File(FLEX_SRC_PATH + flexSrcPath);   
        if (!dir.exists()){   
            dir.mkdirs();   
        }   
        File f = new File(dir,fileName + ".as");   
        if (f.exists()){   
            f.delete();   
        }   
        f.createNewFile();   
  
        FileWriter fw = new FileWriter(f);   
        fw.write("package "+FLEX_PACKAGE+"\n");   
        fw.write("{\n");   
        fw.write("\t[Bindable]\n");   
        fw.write("\tpublic class "+fileName+"{\n");   
        fw.write("\t\tpublic function "+fileName+"(){}\n");   
        //System.out.println(fileName + ":" + clz.getDeclaredFields().length);   
        for (Field fd : clz.getDeclaredFields()) {   
            fw.write(createField(fd));   
        }   
  
        fw.write("\t}\n}");   
        fw.close();   
  
    }   
  
    private static String createField(Field fd){   
        String r = "\t\tpublic var ";   
        Class type = fd.getType();   
        String name = fd.getName();   
        if (name.equals("serialVersionUID")){   
            return "";   
        }   
        if (type.equals(Integer.class) || type.equals(Short.class)) {   
            r = r+name+":int;";   
        }else if (type.equals(Long.class) || type.equals(BigDecimal.class)) {   
            r = r+name+":Number;";   
        }else if (type.equals(String.class)) {   
            r = r+name+":String;";   
        }else if (type.equals(Date.class)) {   
            r = r+name+":Date;";   
        }else if (type.getName().equals("java.lang.Object")){   
            r = r+name+":Object;";   
        }else if (type.getName().equals("long")){   
            r = r+name+":Number;";   
        }else if (type.getName().equals("java.util.List")){   
            r = r+name+":Array;";   
        }else{   
            System.out.println(type.getName());   
        }   
        return r+"\n";   
    }   
  
}  
