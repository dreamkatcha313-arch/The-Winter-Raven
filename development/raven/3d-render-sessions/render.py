import vtk, math, random, os, json
from PIL import Image, ImageDraw
OUT=os.path.dirname(__file__)
def ellipsoid(renderer, xyz, scale, color):
 s=vtk.vtkSphereSource();s.SetThetaResolution(18);s.SetPhiResolution(14)
 m=vtk.vtkPolyDataMapper();m.SetInputConnection(s.GetOutputPort())
 a=vtk.vtkActor();a.SetMapper(m);a.SetPosition(*xyz);a.SetScale(*scale)
 a.GetProperty().SetColor(*color);a.GetProperty().SetAmbient(.65);a.GetProperty().SetDiffuse(.55)
 a.GetProperty().SetSpecular(.38);a.GetProperty().SetSpecularPower(28);renderer.AddActor(a)
def feather(renderer,points,color):
 ps=vtk.vtkPoints()
 for p in points:ps.InsertNextPoint(*p)
 polys=vtk.vtkCellArray()
 for tri in ((0,1,2),(0,2,3)):
  t=vtk.vtkTriangle()
  for i,v in enumerate(tri):t.GetPointIds().SetId(i,v)
  polys.InsertNextCell(t)
 poly=vtk.vtkPolyData();poly.SetPoints(ps);poly.SetPolys(polys)
 normals=vtk.vtkPolyDataNormals();normals.SetInputData(poly);normals.ConsistencyOn();normals.AutoOrientNormalsOn()
 mapper=vtk.vtkPolyDataMapper();mapper.SetInputConnection(normals.GetOutputPort())
 a=vtk.vtkActor();a.SetMapper(mapper);a.GetProperty().SetColor(*color)
 a.GetProperty().SetAmbient(.70);a.GetProperty().SetDiffuse(.48)
 a.GetProperty().SetSpecular(.28);a.GetProperty().SetSpecularPower(28)
 a.GetProperty().BackfaceCullingOff();renderer.AddActor(a)
def render(k):
 ren=vtk.vtkRenderer();ren.GradientBackgroundOn();ren.SetBackground(.12,.20,.29);ren.SetBackground2(.43,.52,.60)
 win=vtk.vtkRenderWindow();win.SetOffScreenRendering(1);win.SetSize(640,400);win.AddRenderer(ren);win.SetMultiSamples(0)
 ellipsoid(ren,(0,-.12,0),(.42,.64,.32),(.12,.16,.21))
 ellipsoid(ren,(0,.44,-.17),(.24,.30,.22),(.12,.16,.21))
 ellipsoid(ren,(0,.64,-.30),(.15,.14,.15),(.12,.16,.21))
 for row in range(7):
  y=.38-row*.13
  for j in range(-3,4):
   x=j*.085*(1-row*.035)
   ellipsoid(ren,(x,y,.28-abs(j)*.017),(.05,.12,.023),(.038+row*.002,.055,.076))
 for j in range(-5,6):
  x=j*.06;length=.65-.23*abs(j)/5
  feather(ren,[(x-.045,-.48,.02),(x+.045,-.48,.02),(x+.025,-.48-length,.10),(x-.025,-.48-length,.10)],(.12,.16,.21))
 wingphase=math.sin(k/20*math.pi*3.2);bank=math.sin(k/20*math.pi*1.6)*.10
 for side in (-1,1):
  lift=.21*wingphase+bank*side
  for j in range(23):
   u=j/22;rootx=side*(.26+1.82*u);rooty=.18+lift*u
   width=.18*(1-u)+.045;length=.32+.27*math.sin(math.pi*u)+.08*(1-u);z=.03-.12*u
   feather(ren,[(rootx-side*.055,rooty,z),(rootx+side*.07,rooty+.018,z),(rootx+side*(.11+width*.3),rooty-length*.74,z+.10),(rootx-side*.03,rooty-length,z+.07)],(.13+u*.012,.18+u*.017,.23+u*.021))
  for j in range(7):
   u=j/6;rootx=side*(1.85+.38*u);rooty=.17+lift*(.8+u*.2)
   feather(ren,[(rootx,rooty,-.07),(rootx+side*.10,rooty+.02,-.08),(rootx+side*(.29-.10*u),rooty-(.27-.06*u),.04),(rootx+side*.04,rooty-.15,.05)],(.12,.16,.21))
 random.seed(222+k*3)
 for i in range(115):
  x=random.uniform(-4.3,4.3);y=random.uniform(-2.5,2.5);z=random.uniform(-2.2,2.4)
  size=random.uniform(.009,.028)*(1.3 if z>1 else 1)
  ellipsoid(ren,(x,y,z),(size,size,size),(.63,.74,.82))
 light=vtk.vtkLight();light.SetPosition(-4+2*math.sin(k*.25),5,7);light.SetFocalPoint(0,0,0);light.SetIntensity(1.7);ren.AddLight(light)
 light2=vtk.vtkLight();light2.SetPosition(4,2,-4);light2.SetIntensity(.75);ren.AddLight(light2)
 camera=ren.GetActiveCamera();camera.SetPosition(.15*math.sin(k*.33),.3+.15*math.cos(k*.2),7.5+1.2*math.sin(k*.17))
 camera.SetFocalPoint(0,0,0);camera.SetViewUp(0,1,0);camera.SetViewAngle(35)
 ren.ResetCameraClippingRange();win.Render()
 filt=vtk.vtkWindowToImageFilter();filt.SetInput(win);filt.Update()
 writer=vtk.vtkPNGWriter();writer.SetFileName(f'{OUT}/render_{k+1:02d}.png');writer.SetInputConnection(filt.GetOutputPort());writer.Write();win.Finalize()
for k in range(20):
 render(k);print('rendered',k+1,flush=True)
ims=[]
for k in range(20):
 im=Image.open(f'{OUT}/render_{k+1:02d}.png').convert('RGB').resize((320,200))
 ImageDraw.Draw(im).text((10,10),f'3D {k+1:02d}',fill=(245,245,245));ims.append(im)
sheet=Image.new('RGB',(1280,1000))
for k,im in enumerate(ims):sheet.paste(im,((k%4)*320,(k//4)*200))
sheet.save(f'{OUT}/contact_sheet.jpg',quality=90)
with open(f'{OUT}/manifest.json','w') as f:
 json.dump({'engine':'VTK 9.6 offscreen','sessions':20,'type':'procedural 3D renders','status':'technical prototypes, not photorealistic or production approved'},f,indent=2)
