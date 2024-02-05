module.exports.details = {
    name: "screenshot",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ Screenshot //////////// 
function string.random(length)
	local res = ""
	for i = 1, length do
		res = res .. string.char(math.random(97, 122))
	end
	return res
end
if not file.IsDir( "emodules/screenshots", "DATA") then 
    file.CreateDir("emodules/screenshots") 
end
local ScreenshotRequested = false
local t = emodules.new()

t.name = "Screenshot"
t.desc = "Permet de prendre des captures d'ecrans\\nChemin d'accées : garrysmod/data/emodules/screenshots"

function t:onStart()
    hook.Add( "PostRender", "emodules:screenshot:screenshot", function()
        if ( !ScreenshotRequested ) then return end
        ScreenshotRequested = false
    
        local data = render.Capture( {
            format = "jpg",
            x = 0,
            y = 0,
            w = ScrW(),
            h = ScrH()
        } )
        file.Write( "emodules/screenshots/"..string.random(25)..".jpg", data )
    end )
    hook.Add( "PlayerButtonUp", "emodules:screenshot:takescreenshot", function( ply, button )
        if not IsFirstTimePredicted() then return end
        if button ~= emodules:getmconfig("Screenshot","touche") then return end 
	    ScreenshotRequested = true  
    end)
end
function t:onStop()
   hook.Remove("PlayerButtonUp", "emodules:screenshot:takescreenshot")
   hook.Remove("PostRender", "emodules:screenshot:screenshot")
end
t:addConfig("open",{
    name = "Voir les screenshots",
    desc = "Vous permets de voir vos screenshots",
    vgui = "DButton",
    text = "Ouvrir",
    callback = function()
        if not emodules:getmactive("Screenshot") then return end
        
        local window = SimpleRP.createWindow()
        window:SetSize(1300, 1000)
        window:Center()
        window:addBottomButton("FERMER", function()
            window:Remove()
        end)

        function window:Paint(w,h) 
            draw.RoundedBox(10, 0, 0, w, h, Color(28, 31, 36, 240))

            draw.SimpleText("Screenshots :","Sansation45",w/2,ScrH()*0.02,Color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
        end

        local Scroll = vgui.Create( "DScrollPanel", window ) 
        Scroll:Dock( FILL )
        Scroll:DockMargin(0,ScrW()*0.03,0,0)

        local List = vgui.Create( "DIconLayout", Scroll )
        List:Dock( FILL )
        List:SetSpaceY( 5 ) 
        List:SetSpaceX( 5 ) 

        local screenshots = file.Find("emodules/screenshots/*","DATA","datedesc")

        for k ,v in ipairs(screenshots) do 
            local mat = Material("data/emodules/screenshots/"..v)
            local id = string.Explode(".",v)[1]

            local screenshot = List:Add( "DButton" ) 
            screenshot:SetText("")
            screenshot:SetSize( ScrW()*0.25, ScrH()*0.25) 
            function screenshot:Paint(w,h)
                surface.SetMaterial( mat )
                surface.SetDrawColor( 255, 255, 255, 255 )
                surface.DrawTexturedRect( 0,0, w,h )
            end
            function screenshot:DoRightClick()
                local Menu = DermaMenu()

                Menu:AddOption( "Supprimer",function ()
                    file.Delete( "emodules/screenshots/"..v )
                    self:Remove()
                end):SetIcon( "icon16/cross.png" )	
                
                Menu:AddOption( "Partager & copier le lien" ,function ()
                    http.Post( "https://screenshot.azuria-studio.fr/upload.php", { steamid = LocalPlayer():SteamID64(), id = id,image= util.Base64Encode(file.Read( "emodules/screenshots/"..v, "DATA" )) },
                    function( body, length, headers, code )
                        SetClipboardText( "https://screenshot.azuria-studio.fr/screenshots/"..LocalPlayer():SteamID64().."/"..v )
                        SimpleRP.addNotification("Vous avez copié le lien de la capture")
                    end,
                    function( message )
                        print( "[ EModules:Screenshot ] erreur lors de l'envoie de l'image a l'api, code de l'erreur : "..message)
                    end)  
                end):SetIcon( "icon16/bullet_go.png" )	
                
                Menu:Open()
            end 
        end
    end
})

t:addConfig("touche",{
    name = "Touche",
    desc = "Touche pour prendre une capture d'ecran",
    vgui = "DBinder",
    defvalue = KEY_F2
})

t:End()

`