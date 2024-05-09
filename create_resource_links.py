import os

for file in os.listdir("."):
    if file.endswith(".html"):
        with open(file) as f:
            s = f.read()

        s = s.replace('href="styles', 'href="../styles')
        s = s.replace('src="scripts', 'src="../scripts')

        with open(file, "w") as f:
            f.write(s)
