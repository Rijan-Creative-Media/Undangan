for img in "$@"
do
  echo "$img"
  target=$(dirname $img)/blue/$(basename $img)
  if [ $(basename $img) = "bg.png" ]
  then
    cp $img $target
  else
    ffmpeg -hide_banner -y -i $img -filter_complex "[0:v]format=rgba,alphaextract[a];[0:v]colortemperature=temperature=40000,colorlevels=bimax=0.8[v];[v][a]alphamerge" $target
  fi
done